import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  PlusCircleIcon, 
  DocumentTextIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
}

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
  const [user] = useState<User | null>(() => {
    const userData = localStorage.getItem('alimed_user');
    return userData ? JSON.parse(userData) : null;
  });
  const [wizyty] = useState<Wizyta[]>(mockWizyty);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('alimed_token');
    const userData = localStorage.getItem('alimed_user');
    
    if (!token || !userData) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('alimed_token');
    localStorage.removeItem('alimed_user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-alimed-blue text-xl">Ładowanie...</div>
      </div>
    );
  }

  const quickActions = [
    { icon: CalendarDaysIcon, title: 'Moje wizyty', subtitle: 'Zobacz historię wizyt', color: 'bg-emerald-100 text-emerald-600' },
    { icon: PlusCircleIcon, title: 'Umów wizytę', subtitle: 'Zarezerwuj termin', color: 'bg-purple-100 text-purple-600' },
    { icon: DocumentTextIcon, title: 'Dokumenty', subtitle: 'Wyniki i recepty', color: 'bg-amber-100 text-amber-600' },
    { icon: UserCircleIcon, title: 'Moje dane', subtitle: 'Edytuj profil', color: 'bg-rose-100 text-rose-600' },
  ];

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
              <span className="text-gray-700">Witaj, {user.imie}</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                Moje konto
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm"
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Nadchodzące wizyty</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Data i godzina</th>
                  <th className="pb-3 font-medium">Lekarz</th>
                  <th className="pb-3 font-medium">Specjalizacja</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Akcje</th>
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
                        {wizyta.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-alimed-blue hover:underline text-sm">
                        Szczegóły
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {wizyty.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Brak nadchodzących wizyt
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
