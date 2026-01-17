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

interface PacjentLekarza {
  id: number;
  imie: string;
  nazwisko: string;
  pesel: string;
  typWizyty: string;
}

// Mock data - w przyszłości z API
const mockPacjenci: PacjentLekarza[] = [
  { id: 1, imie: 'Maria', nazwisko: 'Nowak', pesel: '85031234567', typWizyty: 'Konsultacja' },
  { id: 2, imie: 'Jan', nazwisko: 'Kowalski', pesel: '78012345678', typWizyty: 'Kontrola' },
  { id: 3, imie: 'Anna', nazwisko: 'Wiśniewska', pesel: '92040987654', typWizyty: 'Pierwsza wizyta' },
  { id: 4, imie: 'Piotr', nazwisko: 'Zieliński', pesel: '65081234567', typWizyty: 'Konsultacja' },
  { id: 5, imie: 'Katarzyna', nazwisko: 'Lewandowska', pesel: '88120987654', typWizyty: 'Kontrola' },
];

const mockStatystyki = {
  wizyty: 12,
  pacjenci: 248,
  dokumentacja: 34,
};

const PacjenciLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [pacjenci] = useState<PacjentLekarza[]>(mockPacjenci);
  const [statystyki] = useState(mockStatystyki);
  const [activeCard, setActiveCard] = useState<string>('pacjenci');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewPatient = (id: number) => {
    console.log('Zobacz pacjenta:', id);
    // W przyszłości nawigacja do szczegółów pacjenta
  };

  const handleEditPatient = (id: number) => {
    console.log('Edytuj pacjenta:', id);
    // W przyszłości nawigacja do edycji pacjenta
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
      onClick: () => setActiveCard('pacjenci')
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

        {/* Pacjenci section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('doctorPatients.title')}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('doctorPatients.patient')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('doctorPatients.visitType')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('doctorPatients.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pacjenci.map((pacjent) => (
                  <tr 
                    key={pacjent.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {pacjent.imie} {pacjent.nazwisko}
                        </p>
                        <p className="text-sm text-gray-500">
                          PESEL: {pacjent.pesel}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pacjent.typWizyty}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => handleViewPatient(pacjent.id)}
                          className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                        >
                          {t('doctorPatients.view')}
                        </button>
                        <button 
                          onClick={() => handleEditPatient(pacjent.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium hover:underline"
                        >
                          {t('doctorPatients.edit')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pacjenci.length === 0 && (
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
