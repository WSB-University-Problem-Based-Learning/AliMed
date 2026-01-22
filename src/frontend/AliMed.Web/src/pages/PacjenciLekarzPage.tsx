import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiService } from '../services/api';
import type { Pacjent } from '../types/api';

const PacjenciLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [pacjenci, setPacjenci] = useState<Pacjent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    wizyty: 0,
    pacjenci: 0,
    dokumentacja: 0,
  });
  const [activeCard, setActiveCard] = useState<string>('pacjenci');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isDemoMode) {
          // Mock data for demo mode
          const mockData: Pacjent[] = [
            { pacjentId: 1, imie: 'Maria', nazwisko: 'Nowak', pesel: '85031234567', dataUrodzenia: '1985-03-12', email: 'maria.nowak@example.com' },
            { pacjentId: 2, imie: 'Jan', nazwisko: 'Kowalski', pesel: '78012345678', dataUrodzenia: '1978-01-23', email: 'jan.kowalski@example.com' },
          ];
          setPacjenci(mockData);
          setStats({ wizyty: 0, pacjenci: mockData.length, dokumentacja: 0 });
        } else {
          try {
            const [patientsData, visitsData] = await Promise.all([
              apiService.getLekarzPacjenci(),
              apiService.getLekarzWizyty()
            ]);
            setPacjenci(patientsData);
            setStats({
              wizyty: visitsData.length,
              pacjenci: patientsData.length,
              dokumentacja: 0 // Placeholder as we don't have a direct endpoint for total docs count yet
            });
          } catch (err) {
            console.error('Error details:', err);
            throw err;
          }
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
        setError(t('error.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDemoMode, t]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewPatient = (id: number) => {
    navigate(`/pacjenci-lekarza/${id}`);
  };



  const userName = user?.firstName && user?.lastName
    ? `dr ${user.firstName} ${user.lastName}`
    : user?.firstName || user?.username || user?.githubName || 'Lekarz';

  const statCards = [
    {
      id: 'wizyty',
      icon: CalendarDaysIcon,
      title: t('doctorDashboard.visits'),
      value: stats.wizyty,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-alimed-blue',
      onClick: () => navigate('/wizyty-lekarza')
    },
    {
      id: 'pacjenci',
      icon: UsersIcon,
      title: t('doctorDashboard.patients'),
      value: stats.pacjenci,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500',
      onClick: () => setActiveCard('pacjenci')
    },
    {
      id: 'dokumentacja',
      icon: DocumentTextIcon,
      title: t('doctorDashboard.documentation'),
      value: stats.dokumentacja,
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
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-alimed-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/panel-lekarza')}
            >
              <img src="/logo.svg" alt="AliMed" className="h-10 w-10" />
              <span className="text-2xl font-bold text-alimed-blue">AliMed</span>
            </div>

            {/* User info & actions */}
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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {t('dashboard.demoNotice')}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.id}
              onClick={card.onClick}
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

        {/* Pacjenci section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('doctorPatients.title')}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                {t('common.loading')}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                {error}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorPatients.patient')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('login.email')}
                      {/* Using static string for 'Email' or adding key, but for now Email is universal or I can look for a key */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorPatients.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pacjenci.map((pacjent) => (
                    <tr
                      key={pacjent.pacjentId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {pacjent.imie} {pacjent.nazwisko}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('doctorPatients.peselLabel')}: {pacjent.pesel}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pacjent.email || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleViewPatient(pacjent.pacjentId)}
                            className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                          >
                            {t('doctorPatients.view')}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && !error && pacjenci.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              {t('doctorPatients.noPatients')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PacjenciLekarzPage;
