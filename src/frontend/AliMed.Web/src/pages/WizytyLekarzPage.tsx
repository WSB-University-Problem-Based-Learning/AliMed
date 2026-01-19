import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiService } from '../services/api';
import type { LekarzWizytaSummary } from '../types/api';

const mockWizyty: LekarzWizytaSummary[] = [
  {
    wizytaId: 1,
    dataWizyty: new Date().toISOString(),
    status: 'Zaplanowana',
    pacjent: 'Jan Nowak',
  },
  {
    wizytaId: 2,
    dataWizyty: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'Zaplanowana',
    pacjent: 'Maria Kowalczyk',
  },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const WizytyLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');
  const [wizyty, setWizyty] = useState<LekarzWizytaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWizytaId, setSelectedWizytaId] = useState<number | null>(null);

  const [diagnoza, setDiagnoza] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWizyty = async () => {
      setLoading(true);
      setError(null);

      if (isDemoMode) {
        setWizyty(mockWizyty);
        setLoading(false);
        return;
      }

      try {
        const data =
          range === 'day'
            ? await apiService.getLekarzWizytyDzien(selectedDate)
            : range === 'week'
              ? await apiService.getLekarzWizytyTydzien(selectedDate)
              : await apiService.getLekarzWizytyMiesiac(selectedDate);
        setWizyty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchWizyty();
  }, [selectedDate, range, isDemoMode, t]);

  useEffect(() => {
    if (!selectedWizytaId && wizyty.length > 0) {
      setSelectedWizytaId(wizyty[0].wizytaId);
      return;
    }

    if (selectedWizytaId && !wizyty.some((w) => w.wizytaId === selectedWizytaId)) {
      setSelectedWizytaId(wizyty[0]?.wizytaId ?? null);
    }
  }, [selectedWizytaId, wizyty]);

  useEffect(() => {
    setDiagnoza('');
    setStatusMessage(null);
    setStatusError(null);
  }, [selectedWizytaId]);

  const selectedWizyta = useMemo(
    () => wizyty.find((w) => w.wizytaId === selectedWizytaId) || null,
    [selectedWizytaId, wizyty],
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const normalized = typeof status === 'string' ? status.toLowerCase() : String(status ?? '').toLowerCase();
    if (normalized.includes('zrealizowana') || normalized.includes('odbyta') || normalized.includes('zakoncz')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          Zrealizowana
        </span>
      );
    }
    if (normalized.includes('zaplan')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {t('doctorVisits.statusScheduled')}
        </span>
      );
    }
    if (normalized.includes('anul')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Anulowana
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        {status || '-'}
      </span>
    );
  };

  const userName =
    user?.firstName && user?.lastName
      ? `dr ${user.firstName} ${user.lastName}`
      : user?.firstName || user?.username || user?.githubName || 'Lekarz';

  const visitsCount = wizyty.length;
  const patientsCount = new Set(wizyty.map((w) => (w.pacjent || '').trim()).filter(Boolean)).size;

  const statCards = [
    {
      id: 'wizyty',
      icon: CalendarDaysIcon,
      title: t('doctorDashboard.visits'),
      value: visitsCount,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-alimed-blue',
      onClick: () => undefined,
    },
    {
      id: 'pacjenci',
      icon: UsersIcon,
      title: t('doctorDashboard.patients'),
      value: patientsCount,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500',
      onClick: () => navigate('/pacjenci-lekarza'),
    },
    {
      id: 'moje-dane',
      icon: UserCircleIcon,
      title: t('doctorDashboard.myData'),
      value: null,
      color: 'bg-orange-100 text-orange-500',
      borderColor: 'border-orange-500',
      onClick: () => navigate('/moje-dane-lekarza'),
    },
  ];

  const handleMarkCompleted = async () => {
    if (!selectedWizyta) return;
    setStatusSaving(true);
    setStatusError(null);
    setStatusMessage(null);
    try {
      await apiService.oznaczWizyteOdbyta(selectedWizyta.wizytaId, diagnoza);
      setStatusMessage('Status wizyty zaktualizowany.');
      setWizyty((prev) =>
        prev.map((w) =>
          w.wizytaId === selectedWizyta.wizytaId ? { ...w, status: 'Zrealizowana' } : w,
        ),
      );
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setStatusSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {t('common.error')}: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b-4 border-alimed-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/panel-lekarza')}
            >
              <img src="/logo.svg" alt="AliMed" className="h-10 w-10" />
              <span className="text-2xl font-bold text-alimed-blue">AliMed</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {t('doctorDashboard.welcome')}, {userName}
              </span>
              <LanguageSwitcher />
              <button
                onClick={() => navigate('/moje-dane-lekarza')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('nav.myAccount')}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-alimed-blue rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {t('dashboard.demoNotice')}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.id}
              onClick={card.onClick}
              className="bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-transparent"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">{t('doctorVisits.title')}</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRange('day')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      range === 'day'
                        ? 'bg-alimed-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dzien
                  </button>
                  <button
                    type="button"
                    onClick={() => setRange('week')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      range === 'week'
                        ? 'bg-alimed-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tydzien
                  </button>
                  <button
                    type="button"
                    onClick={() => setRange('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      range === 'month'
                        ? 'bg-alimed-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Miesiac
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500" htmlFor="visit-date">
                    Data bazowa
                  </label>
                  <input
                    id="visit-date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setSelectedWizytaId(null);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorVisits.time')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorVisits.patient')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorVisits.visitType')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorVisits.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorVisits.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wizyty.map((wizyta) => (
                    <tr
                      key={wizyta.wizytaId}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedWizytaId === wizyta.wizytaId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedWizytaId(wizyta.wizytaId)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatTime(wizyta.dataWizyty)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wizyta.pacjent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Wizyta</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(wizyta.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedWizytaId(wizyta.wizytaId);
                          }}
                          className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                        >
                          {t('doctorVisits.details')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {wizyty.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                        Brak wizyt w wybranym dniu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorVisits.visitDetails')}
              </h2>
            </div>

            {selectedWizyta ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('doctorVisits.patient')}</h3>
                  <p className="text-lg font-semibold text-gray-900">{selectedWizyta.pacjent}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('doctorVisits.currentVisit')}</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      {t('doctorVisits.time')}: {formatDate(selectedWizyta.dataWizyty)}{' '}
                      {formatTime(selectedWizyta.dataWizyty)}
                    </p>
                    <p>
                      {t('doctorVisits.status')}: {selectedWizyta.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-500" htmlFor="diagnoza">
                    Diagnoza
                  </label>
                  <textarea
                    id="diagnoza"
                    value={diagnoza}
                    onChange={(event) => setDiagnoza(event.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Wpisz diagnoze do wizyty"
                    disabled={isDemoMode}
                  />
                  {statusError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {statusError}
                    </div>
                  )}
                  {statusMessage && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                      {statusMessage}
                    </div>
                  )}
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-200"
                    onClick={handleMarkCompleted}
                    disabled={
                      statusSaving ||
                      isDemoMode ||
                      (typeof selectedWizyta.status === 'string'
                        ? ['odbyta', 'zrealizowana'].includes(selectedWizyta.status.toLowerCase())
                        : ['odbyta', 'zrealizowana'].includes(String(selectedWizyta.status ?? '').toLowerCase()))
                    }
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    {statusSaving ? 'Zapisywanie...' : 'Oznacz jako zrealizowana'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">{t('doctorVisits.selectVisit')}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WizytyLekarzPage;
