import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { apiService } from '../services/api';
import type { Dokument, DokumentCreateRequest, LekarzWizytaSummary } from '../types/api';

interface NowyDokument {
  wizytaId: number | '';
  typDokumentu: string;
  tresc: string;
}

const mockWizyty: LekarzWizytaSummary[] = [
  {
    wizytaId: 1,
    dataWizyty: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Zrealizowana',
    pacjentId: 1,
    pacjent: 'Maria Nowak',
  },
  {
    wizytaId: 2,
    dataWizyty: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Zrealizowana',
    pacjentId: 2,
    pacjent: 'Jan Kowalski',
  },
  {
    wizytaId: 3,
    dataWizyty: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Zaplanowana',
    pacjentId: 3,
    pacjent: 'Anna Wisniewska',
  },
];

const mockDokumentyByWizyta: Record<number, Dokument[]> = {
  1: [
    {
      dokumentId: 101,
      nazwaPliku: 'wynik-krwi-2024-03-14.txt',
      typDokumentu: 'wynik',
      opis: 'Morfologia krwi - kontrola',
      dataUtworzenia: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      rozmiarPliku: 1200,
      wizytaId: 1,
      pacjentId: 1,
    },
  ],
  2: [
    {
      dokumentId: 102,
      nazwaPliku: 'recepta-2024-03-16.txt',
      typDokumentu: 'recepta',
      opis: 'Recepta na leki kardiologiczne',
      dataUtworzenia: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      rozmiarPliku: 900,
      wizytaId: 2,
      pacjentId: 2,
    },
  ],
};

const DokumentacjaLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [wizyty, setWizyty] = useState<LekarzWizytaSummary[]>([]);
  const [dokumenty, setDokumenty] = useState<Dokument[]>([]);
  const [selectedWizytaId, setSelectedWizytaId] = useState<number | ''>('');
  const [statystyki, setStatystyki] = useState({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingDokumenty, setLoadingDokumenty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string>('dokumentacja');
  const [nowyDokument, setNowyDokument] = useState<NowyDokument>({
    wizytaId: '',
    typDokumentu: '',
    tresc: '',
  });

  const selectedWizyta = useMemo(
    () => wizyty.find(w => w.wizytaId === selectedWizytaId),
    [wizyty, selectedWizytaId]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const loadWizyty = async () => {
      try {
        setLoading(true);
        if (isDemoMode) {
          setWizyty(mockWizyty);
          return;
        }
        const data = await apiService.getLekarzWizyty();
        setWizyty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('doctorDocumentation.errorLoadingVisits'));
      } finally {
        setLoading(false);
      }
    };

    loadWizyty();
  }, [isDemoMode, t]);

  useEffect(() => {
    if (!wizyty.length) {
      setStatystyki({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });
      return;
    }

    const pacjenciSet = new Set(
      wizyty.map(w => w.pacjentId ?? w.pacjent)
    );

    setStatystyki(prev => ({
      ...prev,
      wizyty: wizyty.length,
      pacjenci: pacjenciSet.size,
    }));

    if (selectedWizytaId === '') {
      setSelectedWizytaId(wizyty[0].wizytaId);
      setNowyDokument(prev => ({ ...prev, wizytaId: wizyty[0].wizytaId }));
    }
  }, [wizyty, selectedWizytaId]);

  useEffect(() => {
    const loadDokumenty = async () => {
      if (!selectedWizytaId) {
        setDokumenty([]);
        setStatystyki(prev => ({ ...prev, dokumentacja: 0 }));
        return;
      }

      try {
        setLoadingDokumenty(true);
        if (isDemoMode) {
          const demoDocs = mockDokumentyByWizyta[selectedWizytaId] || [];
          setDokumenty(demoDocs);
          setStatystyki(prev => ({ ...prev, dokumentacja: demoDocs.length }));
          return;
        }
        const docs = await apiService.getDokumentyWizytyLekarz(selectedWizytaId);
        setDokumenty(docs);
        setStatystyki(prev => ({ ...prev, dokumentacja: docs.length }));
      } catch (err) {
        setError(err instanceof Error ? err.message : t('doctorDocumentation.errorLoadingDocuments'));
      } finally {
        setLoadingDokumenty(false);
      }
    };

    loadDokumenty();
  }, [isDemoMode, selectedWizytaId, t]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNowyDokument(prev => ({
      ...prev,
      [name]: name === 'wizytaId' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!nowyDokument.wizytaId || !nowyDokument.typDokumentu) {
      setSubmitError(t('doctorDocumentation.selectVisitAndType'));
      return;
    }

    const payload: DokumentCreateRequest = {
      wizytaId: nowyDokument.wizytaId,
      typDokumentu: nowyDokument.typDokumentu,
      tresc: nowyDokument.tresc || undefined,
    };

    try {
      if (isDemoMode) {
        const newDoc: Dokument = {
          dokumentId: Math.floor(Math.random() * 100000),
          nazwaPliku: `dokument-${nowyDokument.wizytaId}.txt`,
          typDokumentu: nowyDokument.typDokumentu,
          opis: '',
          dataUtworzenia: new Date().toISOString(),
          rozmiarPliku: nowyDokument.tresc.length,
          wizytaId: nowyDokument.wizytaId,
        };
        setDokumenty(prev => [newDoc, ...prev]);
      } else {
        await apiService.createDokument(payload);
        const docs = await apiService.getDokumentyWizytyLekarz(nowyDokument.wizytaId);
        setDokumenty(docs);
      }

      setNowyDokument(prev => ({
        ...prev,
        typDokumentu: '',
        tresc: '',
      }));
      setSubmitSuccess(t('doctorDocumentation.documentSaved'));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('doctorDocumentation.documentSaveError'));
    }
  };

  const getTypBadge = (typ: string) => {
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
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {typ}
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
      onClick: () => navigate('/wizyty-lekarza'),
    },
    {
      id: 'pacjenci',
      icon: UsersIcon,
      title: t('doctorDashboard.patients'),
      value: statystyki.pacjenci,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500',
      onClick: () => navigate('/pacjenci-lekarza'),
    },
    {
      id: 'dokumentacja',
      icon: DocumentTextIcon,
      title: t('doctorDashboard.documentation'),
      value: statystyki.dokumentacja,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-500',
      onClick: () => setActiveCard('dokumentacja'),
    },
    {
      id: 'moje-dane',
      icon: UserCircleIcon,
      title: t('doctorDashboard.myData'),
      value: null,
      color: 'bg-orange-100 text-orange-500',
      borderColor: 'border-orange-500',
      onClick: () => navigate('/moje-dane-lekarza'),
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
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

        {/* Dokumentacja section title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('doctorDocumentation.title')}
        </h2>

        {/* Dokumentacja section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista dokumentow */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {t('doctorDocumentation.documentList')}
              </h3>

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

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dokumenty.map((dokument) => (
                    <tr
                      key={dokument.dokumentId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(dokument.dataUtworzenia)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedWizyta?.pacjent || '-'}
                          </p>
                          {selectedWizyta && (
                            <p className="text-sm text-gray-500">
                              {formatDate(selectedWizyta.dataWizyty)} {formatTime(selectedWizyta.dataWizyty)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypBadge(dokument.typDokumentu || '')}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loadingDokumenty && (
              <div className="px-6 py-12 text-center text-gray-500">
                {t('common.loading')}
              </div>
            )}

            {!loadingDokumenty && dokumenty.length === 0 && (
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
              {/* Wizyta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorVisits.visit')}
                </label>
                <select
                  name="wizytaId"
                  value={nowyDokument.wizytaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors"
                >
                  <option value="">{t('doctorDocumentation.selectVisit')}</option>
                  {wizyty.map(w => (
                    <option key={w.wizytaId} value={w.wizytaId}>
                      {w.pacjent} • {formatDate(w.dataWizyty)} {formatTime(w.dataWizyty)}
                    </option>
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

              {/* Tresc dokumentu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('doctorDocumentation.documentContent')}
                </label>
                <textarea
                  name="tresc"
                  value={nowyDokument.tresc}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t('doctorDocumentation.enterDocumentContent')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-alimed-blue transition-colors resize-none"
                />
              </div>

              {submitError && (
                <div className="text-sm text-red-600">{submitError}</div>
              )}
              {submitSuccess && (
                <div className="text-sm text-green-600">{submitSuccess}</div>
              )}

              <button
                type="submit"
                disabled={loading || loadingDokumenty}
                className="w-full px-4 py-3 bg-alimed-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
