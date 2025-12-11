import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  UserCircleIcon,
  FunnelIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

type TypDokumentu = 'wynik' | 'recepta' | 'opis' | 'skierowanie';

interface DokumentLekarza {
  id: number;
  data: string;
  pacjentImie: string;
  pacjentNazwisko: string;
  pacjentPesel: string;
  typ: TypDokumentu;
}

interface NowyDokument {
  pacjentId: string;
  typDokumentu: string;
  data: string;
  trescDokumentu: string;
}

// Mock data - w przyszłości z API
const mockDokumenty: DokumentLekarza[] = [
  { id: 1, data: '14.03.2024', pacjentImie: 'Maria', pacjentNazwisko: 'Nowak', pacjentPesel: '85031234567', typ: 'wynik' },
  { id: 2, data: '13.03.2024', pacjentImie: 'Jan', pacjentNazwisko: 'Kowalski', pacjentPesel: '78012345678', typ: 'recepta' },
  { id: 3, data: '12.03.2024', pacjentImie: 'Anna', pacjentNazwisko: 'Wiśniewska', pacjentPesel: '92040987654', typ: 'opis' },
  { id: 4, data: '11.03.2024', pacjentImie: 'Piotr', pacjentNazwisko: 'Zieliński', pacjentPesel: '65081234567', typ: 'wynik' },
];

const mockPacjenci = [
  { id: '1', imie: 'Maria', nazwisko: 'Nowak' },
  { id: '2', imie: 'Jan', nazwisko: 'Kowalski' },
  { id: '3', imie: 'Anna', nazwisko: 'Wiśniewska' },
  { id: '4', imie: 'Piotr', nazwisko: 'Zieliński' },
];

const mockStatystyki = {
  wizyty: 12,
  pacjenci: 248,
  dokumentacja: 34,
};

const DokumentacjaLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [dokumenty] = useState<DokumentLekarza[]>(mockDokumenty);
  const [statystyki] = useState(mockStatystyki);
  const [activeCard, setActiveCard] = useState<string>('dokumentacja');
  const [nowyDokument, setNowyDokument] = useState<NowyDokument>({
    pacjentId: '',
    typDokumentu: '',
    data: '',
    trescDokumentu: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewDocument = (id: number) => {
    console.log('Podgląd dokumentu:', id);
    // W przyszłości modal lub nawigacja do szczegółów dokumentu
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNowyDokument(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dodaj dokument:', nowyDokument);
    // W przyszłości wywołanie API
    setNowyDokument({
      pacjentId: '',
      typDokumentu: '',
      data: '',
      trescDokumentu: ''
    });
  };

  const getTypBadge = (typ: TypDokumentu) => {
    switch (typ) {
      case 'wynik':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            {t('doctorDocumentation.typeWynik')}
          </span>
        );
      case 'recepta':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            {t('doctorDocumentation.typeRecepta')}
          </span>
        );
      case 'opis':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
            {t('doctorDocumentation.typeOpis')}
          </span>
        );
      case 'skierowanie':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
            {t('doctorDocumentation.typeSkierowanie')}
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
      onClick: () => setActiveCard('dokumentacja')
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

        {/* Dokumentacja section title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('doctorDocumentation.title')}
        </h2>

        {/* Dokumentacja section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista dokumentów */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {t('doctorDocumentation.documentList')}
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <FunnelIcon className="w-4 h-4" />
                {t('doctorDocumentation.filter')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorDocumentation.date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorDocumentation.patient')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorDocumentation.type')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorDocumentation.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dokumenty.map((dokument) => (
                    <tr 
                      key={dokument.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dokument.data}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {dokument.pacjentImie} {dokument.pacjentNazwisko}
                          </p>
                          <p className="text-sm text-gray-500">
                            PESEL: {dokument.pacjentPesel}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypBadge(dokument.typ)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleViewDocument(dokument.id)}
                          className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                        >
                          {t('doctorDocumentation.preview')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {dokumenty.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                {t('doctorDocumentation.noDocuments')}
              </div>
            )}
          </div>

          {/* Formularz dodawania dokumentu */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">
                {t('doctorDocumentation.addDocument')}
              </h3>
            </div>
            
            <form onSubmit={handleSubmitDocument} className="p-6 space-y-4">
              {/* Pacjent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorDocumentation.patient')}
                </label>
                <select
                  name="pacjentId"
                  value={nowyDokument.pacjentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors"
                >
                  <option value="">{t('doctorDocumentation.selectPatient')}</option>
                  {mockPacjenci.map(p => (
                    <option key={p.id} value={p.id}>{p.imie} {p.nazwisko}</option>
                  ))}
                </select>
              </div>

              {/* Typ dokumentu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorDocumentation.documentType')}
                </label>
                <select
                  name="typDokumentu"
                  value={nowyDokument.typDokumentu}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors"
                >
                  <option value="">{t('doctorDocumentation.selectDocumentType')}</option>
                  <option value="wynik">{t('doctorDocumentation.typeWynik')}</option>
                  <option value="recepta">{t('doctorDocumentation.typeRecepta')}</option>
                  <option value="opis">{t('doctorDocumentation.typeOpis')}</option>
                  <option value="skierowanie">{t('doctorDocumentation.typeSkierowanie')}</option>
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorDocumentation.date')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="data"
                    value={nowyDokument.data}
                    onChange={handleInputChange}
                    placeholder="dd.mm.rrrr"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Treść dokumentu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorDocumentation.documentContent')}
                </label>
                <textarea
                  name="trescDokumentu"
                  value={nowyDokument.trescDokumentu}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t('doctorDocumentation.enterDocumentContent')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors resize-none"
                />
              </div>

              {/* Submit button - w przyszłości */}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-alimed-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('doctorDocumentation.saveDocument')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DokumentacjaLekarzPage;
