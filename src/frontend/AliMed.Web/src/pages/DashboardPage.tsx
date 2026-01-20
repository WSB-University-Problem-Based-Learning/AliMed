import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  PlusCircleIcon, 
  DocumentTextIcon, 
  UserCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import type { User, Wizyta } from '../types/api';
import { apiService } from '../services/api';

const DashboardPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user: authUser, logout, isDemoMode } = useAuth();
    const [wizyty, setWizyty] = useState<Wizyta[]>([]);
    const [loading, setLoading] = useState(true);
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
  const [selectedWizyta, setSelectedWizyta] = useState<Wizyta | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alimed_token');
    
    // Only redirect if there's no token at all
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWizyty();
        // Filter only upcoming visits
        const now = new Date();
        const upcomingWizyty = data.filter(w => 
          !w.czyOdbyta && new Date(w.dataWizyty) >= now
        );
        setWizyty(upcomingWizyty);
      } catch (err) {
        console.error('Failed to fetch wizyty:', err);
        setWizyty([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWizyty();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'szl' ? 'pl-PL' : 'pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'szl' ? 'pl-PL' : 'pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


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
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
          ) : wizyty.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('dashboard.noUpcomingVisits')}
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">{t('dashboard.dateTime')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.doctor')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.specialization')}</th>
                  <th className="pb-3 font-medium">{t('dashboard.facility')}</th>
                  <th className="pb-3 font-medium">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wizyty.map((wizyta) => (
                  <tr key={wizyta.wizytaId} className="text-sm">
                    <td className="py-4 text-gray-900">
                      {formatDate(wizyta.dataWizyty)} {formatTime(wizyta.dataWizyty)}
                    </td>
                    <td className="py-4 text-gray-900">
                      {wizyta.lekarz ? `${wizyta.lekarz.imie} ${wizyta.lekarz.nazwisko}` : '-'}
                    </td>
                    <td className="py-4 text-gray-600">
                      {wizyta.lekarz?.specjalizacja || '-'}
                    </td>
                    <td className="py-4 text-gray-600">
                      {typeof wizyta.placowka === 'string' ? wizyta.placowka : wizyta.placowka?.nazwa || '-'}
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => setSelectedWizyta(wizyta)}
                        className="text-alimed-blue hover:underline text-sm"
                      >
                        {t('common.details')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>

      {/* Visit Details Modal */}
      {selectedWizyta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedWizyta(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.visitDetails')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('dashboard.dateTime')}</label>
                <p className="text-gray-900">
                  {formatDate(selectedWizyta.dataWizyty)} {formatTime(selectedWizyta.dataWizyty)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('dashboard.doctor')}</label>
                <p className="text-gray-900">
                  {selectedWizyta.lekarz ? `${selectedWizyta.lekarz.imie} ${selectedWizyta.lekarz.nazwisko}` : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('dashboard.specialization')}</label>
                <p className="text-gray-900">{selectedWizyta.lekarz?.specjalizacja || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('dashboard.facility')}</label>
                <p className="text-gray-900">
                  {typeof selectedWizyta.placowka === 'string' 
                    ? selectedWizyta.placowka 
                    : selectedWizyta.placowka?.nazwa || '-'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedWizyta(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  setSelectedWizyta(null);
                  navigate('/moje-wizyty');
                }}
                className="flex-1 px-4 py-2 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t('dashboard.myVisits')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
