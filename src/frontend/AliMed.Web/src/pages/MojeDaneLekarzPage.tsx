import React, { useState } from 'react';
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

interface DaneLekarz {
  imie: string;
  nazwisko: string;
  specjalizacja: string;
  miasto: string;
  email: string;
  telefon: string;
  godzinyPracy: string;
}

const mockStatystyki = {
  wizyty: 12,
  pacjenci: 248,
  dokumentacja: 34,
};

const MojeDaneLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [statystyki] = useState(mockStatystyki);
  const [activeCard, setActiveCard] = useState<string>('moje-dane');
  const [daneLekarz, setDaneLekarz] = useState<DaneLekarz>({
    imie: user?.firstName || '',
    nazwisko: user?.lastName || '',
    specjalizacja: '',
    miasto: '',
    email: user?.email || '',
    telefon: '',
    godzinyPracy: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDaneLekarz(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Symulacja zapisywania - w przyszłości wywołanie API
    console.log('Zapisz dane lekarza:', daneLekarz);
    
    setTimeout(() => {
      setIsSaving(false);
      // Można dodać notyfikację o sukcesie
    }, 1000);
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

        {/* Moje dane section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('doctorMyData.title')}
        </h2>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Imię */}
              <div>
                <input
                  type="text"
                  name="imie"
                  value={daneLekarz.imie}
                  onChange={handleInputChange}
                  placeholder={t('doctorMyData.firstName')}
                  className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
                />
              </div>

              {/* Nazwisko */}
              <div>
                <input
                  type="text"
                  name="nazwisko"
                  value={daneLekarz.nazwisko}
                  onChange={handleInputChange}
                  placeholder={t('doctorMyData.lastName')}
                  className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Specjalizacja */}
            <div className="mb-4">
              <input
                type="text"
                name="specjalizacja"
                value={daneLekarz.specjalizacja}
                onChange={handleInputChange}
                placeholder={t('doctorMyData.specialization')}
                className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
              />
            </div>

            {/* Miasto */}
            <div className="mb-4">
              <input
                type="text"
                name="miasto"
                value={daneLekarz.miasto}
                onChange={handleInputChange}
                placeholder={t('doctorMyData.city')}
                className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
              />
            </div>

            {/* Adres e-mail */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={daneLekarz.email}
                onChange={handleInputChange}
                placeholder={t('doctorMyData.email')}
                className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Numer telefonu */}
              <div>
                <input
                  type="tel"
                  name="telefon"
                  value={daneLekarz.telefon}
                  onChange={handleInputChange}
                  placeholder={t('doctorMyData.phone')}
                  className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
                />
              </div>

              {/* Godziny pracy */}
              <div>
                <input
                  type="text"
                  name="godzinyPracy"
                  value={daneLekarz.godzinyPracy}
                  onChange={handleInputChange}
                  placeholder={t('doctorMyData.workingHours')}
                  className="w-full px-4 py-3 border-2 border-alimed-blue/30 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-[#5BC0DE] text-white font-medium rounded-lg hover:bg-[#4ab0ce] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? t('common.loading') : t('doctorMyData.save')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MojeDaneLekarzPage;
