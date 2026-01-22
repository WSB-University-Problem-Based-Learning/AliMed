import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  UserCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiService } from '../services/api';

const MojeDaneLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [statystyki, setStatystyki] = useState({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });
  const [lekarzDetails, setLekarzDetails] = useState<{ specjalizacja?: string; placowkaId?: number } | null>(null);

  useEffect(() => {
    const fetchStatsAndProfile = async () => {
      try {
        if (isDemoMode) {
          setStatystyki({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });
        } else {
          try {
            const dateOnly = new Date().toISOString().split('T')[0];
            const [
              wizytyTygodnia,
              pacjenci,
              allDoctors
            ] = await Promise.all([
              apiService.getLekarzWizytyTydzien(dateOnly),
              apiService.getLekarzPacjenci(),
              apiService.getLekarze()
            ]);

            setStatystyki({
              wizyty: wizytyTygodnia.length,
              pacjenci: pacjenci.length,
              dokumentacja: 0,
            });

            // Try to find current doctor by matching first/last name from auth user
            if (user?.firstName && user?.lastName) {
              const found = allDoctors.find(
                d => d.imie?.toLowerCase() === user.firstName?.toLowerCase() &&
                  d.nazwisko?.toLowerCase() === user.lastName?.toLowerCase()
              );
              if (found) {
                setLekarzDetails({ specjalizacja: found.specjalizacja, placowkaId: found.placowkaId });
              }
            }

          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatsAndProfile();
  }, [isDemoMode, user]);
  const [activeCard, setActiveCard] = useState<string>('moje-dane');

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const userName = user?.firstName && user?.lastName
    ? `dr ${user.firstName} ${user.lastName}`
    : user?.firstName || user?.username || user?.githubName || 'Lekarz';

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
      onClick: () => setActiveCard('moje-dane')
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
                onClick={() => setActiveCard('moje-dane')}
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

        {/* Moje dane section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('doctorMyData.title')}
        </h2>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-start gap-3">
            <InformationCircleIcon className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Informacja</p>
              <p className="text-sm mt-1">
                Twoje dane są zarządzane przez administratora systemu. W przypadku konieczności zmiany danych (np. specjalizacja, nazwisko), prosimy o kontakt z działem administracji.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.firstName')}</label>
              <p className="text-lg font-medium text-gray-900">{user?.firstName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.lastName')}</label>
              <p className="text-lg font-medium text-gray-900">{user?.lastName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.email')}</label>
              <p className="text-lg font-medium text-gray-900">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.specialization')}</label>
              <p className="text-lg font-medium text-gray-900">
                {lekarzDetails?.specjalizacja ? lekarzDetails.specjalizacja : <span className="italic text-gray-500">(Pobierane z systemu)</span>}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MojeDaneLekarzPage;
