import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  UserCircleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface NadchodzacaWizyta {
  id: number;
  pacjentImie: string;
  pacjentNazwisko: string;
  typWizyty: string;
  godzina: string;
  dzien: 'dzisiaj' | 'jutro' | string;
}

interface OczekujacaWizyta {
  id: number;
  pacjentImie: string;
  pacjentNazwisko: string;
  dataGodzina: string;
}

// Mock data - w przyszłości z API
const mockNadchodzaceWizyty: NadchodzacaWizyta[] = [
  { id: 1, pacjentImie: 'Anna', pacjentNazwisko: 'Nowak', typWizyty: 'Konsultacja ogólna', godzina: '10:00', dzien: 'dzisiaj' },
  { id: 2, pacjentImie: 'Piotr', pacjentNazwisko: 'Wiśniewski', typWizyty: 'Kontrola okresowa', godzina: '11:30', dzien: 'dzisiaj' },
  { id: 3, pacjentImie: 'Maria', pacjentNazwisko: 'Kowalczyk', typWizyty: 'Badanie specjalistyczne', godzina: '14:00', dzien: 'dzisiaj' },
  { id: 4, pacjentImie: 'Tomasz', pacjentNazwisko: 'Lewandowski', typWizyty: 'Konsultacja', godzina: '15:30', dzien: 'dzisiaj' },
];

const mockOczekujaceWizyty: OczekujacaWizyta[] = [
  { id: 1, pacjentImie: 'Katarzyna', pacjentNazwisko: 'Zielińska', dataGodzina: '15.12.2024, 09:00' },
  { id: 2, pacjentImie: 'Michał', pacjentNazwisko: 'Szymański', dataGodzina: '15.12.2024, 11:00' },
  { id: 3, pacjentImie: 'Agnieszka', pacjentNazwisko: 'Dąbrowska', dataGodzina: '16.12.2024, 10:30' },
  { id: 4, pacjentImie: 'Kamil', pacjentNazwisko: 'Wójcik', dataGodzina: '16.12.2024, 14:00' },
];

const mockStatystyki = {
  wizyty: 12,
  pacjenci: 248,
  dokumentacja: 34,
};

const DoctorDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [nadchodzaceWizyty] = useState<NadchodzacaWizyta[]>(mockNadchodzaceWizyty);
  const [oczekujaceWizyty, setOczekujaceWizyty] = useState<OczekujacaWizyta[]>(mockOczekujaceWizyty);
  const [statystyki] = useState(mockStatystyki);
  const [activeCard, setActiveCard] = useState<string>('wizyty');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConfirmVisit = (id: number) => {
    // W przyszłości wywołanie API
    setOczekujaceWizyty(prev => prev.filter(w => w.id !== id));
    console.log('Potwierdzono wizytę:', id);
  };

  const handleRejectVisit = (id: number) => {
    // W przyszłości wywołanie API
    setOczekujaceWizyty(prev => prev.filter(w => w.id !== id));
    console.log('Odrzucono wizytę:', id);
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
      borderColor: 'border-alimed-blue'
    },
    { 
      id: 'pacjenci',
      icon: UsersIcon, 
      title: t('doctorDashboard.patients'), 
      value: statystyki.pacjenci,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500'
    },
    { 
      id: 'dokumentacja',
      icon: DocumentTextIcon, 
      title: t('doctorDashboard.documentation'), 
      value: statystyki.dokumentacja,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-500'
    },
    { 
      id: 'moje-dane',
      icon: UserCircleIcon, 
      title: t('doctorDashboard.myData'), 
      value: null,
      color: 'bg-orange-100 text-orange-500',
      borderColor: 'border-orange-500',
      onClick: () => navigate('/moje-dane')
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-alimed-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
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
                onClick={() => navigate('/moje-dane')}
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
              onClick={() => card.onClick ? card.onClick() : setActiveCard(card.id)}
              className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
                activeCard === card.id ? `border-2 ${card.borderColor}` : 'border-2 border-transparent'
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

        {/* Two column layout for visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nadchodzące wizyty */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorDashboard.upcomingVisits')}
              </h2>
              <button className="text-alimed-blue text-sm font-medium hover:underline">
                {t('doctorDashboard.seeAll')}
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {nadchodzaceWizyty.map((wizyta) => (
                <div key={wizyta.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {wizyta.pacjentImie} {wizyta.pacjentNazwisko}
                      </p>
                      <p className="text-sm text-gray-500">{wizyta.typWizyty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{wizyta.godzina}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {wizyta.dzien === 'dzisiaj' ? t('doctorDashboard.today') : wizyta.dzien}
                      </p>
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

          {/* Oczekujące potwierdzenia */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorDashboard.pendingConfirmations')}
              </h2>
              <span className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
                {oczekujaceWizyty.length} {t('doctorDashboard.new')}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {oczekujaceWizyty.map((wizyta) => (
                <div key={wizyta.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {wizyta.pacjentImie} {wizyta.pacjentNazwisko}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('doctorDashboard.visit')} - {wizyta.dataGodzina}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleConfirmVisit(wizyta.id)}
                        className="w-9 h-9 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                        title={t('doctorDashboard.confirm')}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectVisit(wizyta.id)}
                        className="w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        title={t('doctorDashboard.reject')}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {oczekujaceWizyty.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  {t('doctorDashboard.noPendingConfirmations')}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboardPage;
