import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  PlusCircleIcon, 
  DocumentTextIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import type { User } from '../types/api';

interface Wizyta {
  id: number;
  dataGodzina: string;
  lekarz: string;
  specjalizacja: string;
  status: 'Potwierdzona' | 'Oczekująca';
}

// Mock data dla wizyt (w przyszłości z API)
const mockWizyty: Wizyta[] = [
  { id: 1, dataGodzina: '12.06.2025 14:30', lekarz: 'dr Jan Nowak', specjalizacja: 'Kardiolog', status: 'Potwierdzona' },
  { id: 2, dataGodzina: '15.06.2025 10:15', lekarz: 'dr Maria Kowalska', specjalizacja: 'Dermatolog', status: 'Oczekująca' },
  { id: 3, dataGodzina: '18.06.2025 16:00', lekarz: 'dr Piotr Wiśniewski', specjalizacja: 'Ortopeda', status: 'Potwierdzona' },
  { id: 4, dataGodzina: '22.06.2025 11:30', lekarz: 'dr Anna Zielińska', specjalizacja: 'Ginekolog', status: 'Oczekująca' },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser, logout, isDemoMode } = useAuth();
  const [user] = useState<User | null>(() => {
    if (authUser) return authUser;
    const userData = localStorage.getItem('alimed_user');
    if (userData) {
      return JSON.parse(userData);
    }
    // Fallback: if we have a token but no user data, create minimal user
    const token = localStorage.getItem('alimed_token');
    if (token) {
      try {
        // Decode JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.nameid || 'unknown',
          email: payload.email || '',
          firstName: payload.unique_name || payload.github_login || 'User',
          lastName: '',
          role: 0,
        };
      } catch {
        return { userId: 'unknown', email: '', firstName: 'User', lastName: '', role: 0 };
      }
    }
    return null;
  });
  const [wizyty] = useState<Wizyta[]>(mockWizyty);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alimed_token');
    
    // Only redirect if there's no token at all
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const quickActions = [
    { 
      icon: CalendarDaysIcon, 
      title: t('dashboard.myVisits'), 
      subtitle: t('dashboard.myVisitsDesc'), 
      color: 'bg-emerald-100 text-emerald-600',
      onClick: () => navigate('/moje-wizyty')
    },
    { 
      icon: PlusCircleIcon, 
      title: t('dashboard.bookVisit'), 
      subtitle: t('dashboard.bookVisitDesc'), 
      color: 'bg-purple-100 text-purple-600',
      onClick: () => navigate('/umow-wizyte')
    },
    { 
      icon: DocumentTextIcon, 
      title: t('dashboard.documents'), 
      subtitle: t('dashboard.documentsDesc'), 
      color: 'bg-amber-100 text-amber-600',
      onClick: () => navigate('/dokumenty')
    },
    { 
      icon: UserCircleIcon, 
      title: t('dashboard.myData'), 
      subtitle: t('dashboard.myDataDesc'), 
      color: 'bg-rose-100 text-rose-600',
      onClick: () => navigate('/moje-dane')
    },
  ];

  const getStatusText = (status: string) => {
    return status === 'Potwierdzona' ? t('dashboard.confirmed') : t('dashboard.pending');
  };

  const userName = user.firstName || user.username || user.githubName || 'User';

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/logo.svg" alt="AliMed" className="h-20" />
            </div>

            {/* User info */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-gray-700">{t('dashboard.welcome')}, {userName}</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                {t('nav.myAccount')}
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo mode notice */}
        {isDemoMode && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">
                  {t('dashboard.demoNotice')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition text-left"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Upcoming visits */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.upcomingVisits')}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">{t('dashboard.dateTime')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.doctor')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.specialization')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.status')}</th>
                  <th className="pb-3 font-medium">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wizyty.map((wizyta) => (
                  <tr key={wizyta.id} className="text-sm">
                    <td className="py-4 text-gray-900">{wizyta.dataGodzina}</td>
                    <td className="py-4 text-gray-900">{wizyta.lekarz}</td>
                    <td className="py-4 text-gray-600">{wizyta.specjalizacja}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        wizyta.status === 'Potwierdzona' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getStatusText(wizyta.status)}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-alimed-blue hover:underline text-sm">
                        {t('common.details')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {wizyty.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t('dashboard.noUpcomingVisits')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
