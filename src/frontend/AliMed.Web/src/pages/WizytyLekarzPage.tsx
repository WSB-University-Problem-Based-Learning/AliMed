import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  UserCircleIcon,
  PencilSquareIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

type StatusWizyty = 'zakonczona' | 'w-trakcie' | 'zaplanowana';

interface WizytaLekarza {
  id: number;
  godzina: string;
  pacjentImie: string;
  pacjentNazwisko: string;
  pacjentPesel: string;
  typWizyty: string;
  status: StatusWizyty;
  historiaChoroby: string[];
  ostatniaWizyta?: string;
}

// Mock data - w przyszłości z API
const mockWizyty: WizytaLekarza[] = [
  { 
    id: 1, 
    godzina: '09:00', 
    pacjentImie: 'Jan', 
    pacjentNazwisko: 'Nowak', 
    pacjentPesel: '85010112345',
    typWizyty: 'Kontrola', 
    status: 'zakonczona',
    historiaChoroby: ['Nadciśnienie tętnicze (2019)', 'Cukrzyca typu 2 (2020)', 'Alergia na penicylinę'],
    ostatniaWizyta: '15.10.2024'
  },
  { 
    id: 2, 
    godzina: '10:30', 
    pacjentImie: 'Maria', 
    pacjentNazwisko: 'Kowalczyk', 
    pacjentPesel: '90052367890',
    typWizyty: 'Konsultacja', 
    status: 'w-trakcie',
    historiaChoroby: ['Astma oskrzelowa (2015)', 'Migrena (2018)'],
    ostatniaWizyta: '20.11.2024'
  },
  { 
    id: 3, 
    godzina: '12:00', 
    pacjentImie: 'Piotr', 
    pacjentNazwisko: 'Wiśniewski', 
    pacjentPesel: '78031245678',
    typWizyty: 'Badanie', 
    status: 'zaplanowana',
    historiaChoroby: ['Choroba wieńcowa (2017)'],
    ostatniaWizyta: '05.09.2024'
  },
  { 
    id: 4, 
    godzina: '14:00', 
    pacjentImie: 'Anna', 
    pacjentNazwisko: 'Zielińska', 
    pacjentPesel: '95071598765',
    typWizyty: 'Kontrola', 
    status: 'zaplanowana',
    historiaChoroby: ['Niedoczynność tarczycy (2021)'],
    ostatniaWizyta: '01.12.2024'
  },
  { 
    id: 5, 
    godzina: '15:30', 
    pacjentImie: 'Tomasz', 
    pacjentNazwisko: 'Kaczmarek', 
    pacjentPesel: '82042356789',
    typWizyty: 'Konsultacja', 
    status: 'zaplanowana',
    historiaChoroby: ['Refluks żołądkowo-przełykowy (2022)', 'Kamica żółciowa (2023)'],
    ostatniaWizyta: '28.11.2024'
  },
];

const mockStatystyki = {
  wizyty: 12,
  pacjenci: 248,
  dokumentacja: 34,
};

const WizytyLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [wizyty] = useState<WizytaLekarza[]>(mockWizyty);
  const [wybranaWizyta, setWybranaWizyta] = useState<WizytaLekarza | null>(mockWizyty[0]);
  const [statystyki] = useState(mockStatystyki);
  const [activeCard, setActiveCard] = useState<string>('wizyty');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: StatusWizyty) => {
    switch (status) {
      case 'zakonczona':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            {t('doctorVisits.statusCompleted')}
          </span>
        );
      case 'w-trakcie':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {t('doctorVisits.statusInProgress')}
          </span>
        );
      case 'zaplanowana':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            {t('doctorVisits.statusScheduled')}
          </span>
        );
    }
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
      onClick: () => setActiveCard('wizyty')
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

        {/* Wizyty section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabela wizyt */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('doctorVisits.title')}
              </h2>
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
                      key={wizyta.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        wybranaWizyta?.id === wizyta.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setWybranaWizyta(wizyta)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {wizyta.godzina}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wizyta.pacjentImie} {wizyta.pacjentNazwisko}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {wizyta.typWizyty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(wizyta.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setWybranaWizyta(wizyta);
                          }}
                          className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                        >
                          {t('doctorVisits.details')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel szczegółów wizyty */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('doctorVisits.visitDetails')}
              </h2>
            </div>
            
            {wybranaWizyta ? (
              <div className="p-6 space-y-6">
                {/* Pacjent */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t('doctorVisits.patient')}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {wybranaWizyta.pacjentImie} {wybranaWizyta.pacjentNazwisko}
                  </p>
                  <p className="text-sm text-gray-500">
                    PESEL: {wybranaWizyta.pacjentPesel}
                  </p>
                </div>

                {/* Historia chorób */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t('doctorVisits.medicalHistory')}
                  </h3>
                  <ul className="space-y-1">
                    {wybranaWizyta.historiaChoroby.map((choroba, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        {choroba}
                      </li>
                    ))}
                  </ul>
                  {wybranaWizyta.ostatniaWizyta && (
                    <p className="text-sm text-gray-500 mt-2">
                      • {t('doctorVisits.lastVisit')}: {wybranaWizyta.ostatniaWizyta}
                    </p>
                  )}
                </div>

                {/* Obecna wizyta */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t('doctorVisits.currentVisit')}
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{t('doctorVisits.time')}: {wybranaWizyta.godzina}</p>
                    <p>{t('doctorVisits.type')}: {wybranaWizyta.typWizyty}</p>
                    <p>{t('doctorVisits.status')}: {
                      wybranaWizyta.status === 'zakonczona' ? t('doctorVisits.statusCompleted') :
                      wybranaWizyta.status === 'w-trakcie' ? t('doctorVisits.statusInProgress') :
                      t('doctorVisits.statusScheduled')
                    }</p>
                  </div>
                </div>

                {/* Akcje */}
                <div className="space-y-3 pt-4">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <PencilSquareIcon className="w-5 h-5" />
                    {t('doctorVisits.addNote')}
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                    <DocumentPlusIcon className="w-5 h-5" />
                    {t('doctorVisits.issuePrescription')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                {t('doctorVisits.selectVisit')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WizytyLekarzPage;
