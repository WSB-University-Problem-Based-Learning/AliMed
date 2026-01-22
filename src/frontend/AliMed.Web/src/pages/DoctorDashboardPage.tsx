import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { Dokument, LekarzWizytaSummary } from '../types/api';

interface NadchodzacaWizyta {
  id: number;
  pacjent: string;
  godzina: string;
  dzien: string;
  status: string;
}

const DoctorDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [nadchodzaceWizyty, setNadchodzaceWizyty] = useState<NadchodzacaWizyta[]>([]);
  const [wizytyTygodnia, setWizytyTygodnia] = useState<NadchodzacaWizyta[]>([]);
  const [statystyki, setStatystyki] = useState({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string>('wizyty');

  const dzisiaj = useMemo(() => new Date(), []);
  const dateOnly = dzisiaj.toISOString().split('T')[0];

  const mapWizyty = (wizyty: LekarzWizytaSummary[]): NadchodzacaWizyta[] =>
    wizyty.map(w => {
      const date = new Date(w.dataWizyty);
      return {
        id: w.wizytaId,
        pacjent: w.pacjent,
        godzina: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dzien: date.toLocaleDateString(),
        status: w.status,
      };
    });

  const countDocuments = async (wizyty: LekarzWizytaSummary[]) => {
    if (!wizyty.length) return 0;
    const docs = await Promise.all(
      wizyty.map(w => apiService.getDokumentyWizytyLekarz(w.wizytaId).catch(() => [] as Dokument[]))
    );
    return docs.reduce((sum, list) => sum + list.length, 0);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [wizytyDnia, wizytyTygodniaResp, pacjenci] = await Promise.all([
          apiService.getLekarzWizytyDzien(dateOnly),
          apiService.getLekarzWizytyTydzien(dateOnly),
          apiService.getLekarzPacjenci(),
        ]);

        const mappedDay = mapWizyty(wizytyDnia);
        const mappedWeek = mapWizyty(wizytyTygodniaResp);
        setNadchodzaceWizyty(mappedDay);
        setWizytyTygodnia(mappedWeek);

        const dokumentyCount = await countDocuments(wizytyDnia);
        setStatystyki({
          wizyty: wizytyTygodniaResp.length,
          pacjenci: pacjenci.length,
          dokumentacja: dokumentyCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : t('doctorDashboard.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    if (!isDemoMode) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [dateOnly, isDemoMode, t]);

  const statCards = [
    {
      id: 'wizyty',
      icon: CalendarDaysIcon,
      title: t('doctorDashboard.visits'),
      value: statystyki.wizyty,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-alimed-blue',
      onClick: () => navigate('/wizyty-lekarza')
    },
    {
      id: 'pacjenci',
      icon: UsersIcon,
      title: t('doctorDashboard.patients'),
      value: statystyki.pacjenci,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500',
      onClick: () => navigate('/pacjenci-lekarza')
    },
    {
      id: 'dokumentacja',
      icon: DocumentTextIcon,
      title: t('doctorDashboard.documentation'),
      value: statystyki.dokumentacja,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-500',
      onClick: () => navigate('/dokumentacja-lekarza')
    },
    {
      id: 'moje-dane',
      icon: UserCircleIcon,
      title: t('doctorDashboard.myData'),
      value: null,
      color: 'bg-orange-100 text-orange-500',
      borderColor: 'border-orange-500',
      onClick: () => navigate('/moje-dane-lekarza')
    },
  ];

  return (
    <div>
      {/* Demo notice */}
      {isDemoMode && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          {t('dashboard.demoNotice')}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.id}
            onClick={() => card.onClick ? card.onClick() : setActiveCard(card.id)}
            className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${activeCard === card.id ? `border-2 ${card.borderColor}` : 'border-2 border-transparent'
              }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="text-gray-600 font-medium mb-2">{card.title}</h3>
              {card.value !== null && (
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">{t('common.loading')}</div>
      ) : (
        /* Two column layout for visits */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nadchodzące wizyty */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorDashboard.upcomingVisits')}
              </h2>
              <button
                onClick={() => navigate('/wizyty-lekarza')}
                className="text-alimed-blue text-sm font-medium hover:underline"
              >
                {t('doctorDashboard.seeAll')}
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {nadchodzaceWizyty.map((wizyta) => (
                <div key={wizyta.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {wizyta.pacjent}
                      </p>
                      <p className="text-sm text-gray-500">{t('doctorDashboard.statusLabel')}: {wizyta.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{wizyta.godzina}</p>
                      <p className="text-sm text-gray-500 capitalize">{wizyta.dzien}</p>
                    </div>
                  </div>
                </div>
              ))}
              {nadchodzaceWizyty.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  {t('doctorDashboard.noUpcomingVisits')}
                </div>
              )}
            </div>
          </div>

          {/* Wizyty w tym tygodniu */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorDashboard.weeklyVisits')}
              </h2>
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-100">
              {wizytyTygodnia.map((wizyta) => (
                <div key={wizyta.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {wizyta.pacjent}
                      </p>
                      <p className="text-sm text-gray-500">
                        {wizyta.dzien}, {wizyta.godzina}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{t('doctorDashboard.statusLabel')}: {wizyta.status}</span>
                  </div>
                </div>
              ))}
              {wizytyTygodnia.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  {t('doctorDashboard.noWeeklyVisits')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;
