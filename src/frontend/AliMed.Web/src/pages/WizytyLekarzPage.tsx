import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UsersIcon,
  UserCircleIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { Dokument, DokumentCreateRequest, LekarzWizytaSummary } from '../types/api';
import { fetchDoctorStats } from '../utils/doctorStats';

const mockWizyty: LekarzWizytaSummary[] = [
  {
    wizytaId: 1,
    dataWizyty: new Date().toISOString(),
    status: 'Zaplanowana',
    pacjent: 'Jan Nowak',
  },
  {
    wizytaId: 2,
    dataWizyty: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'Zaplanowana',
    pacjent: 'Maria Kowalczyk',
  },
];

const mockDokumenty: Dokument[] = [
  {
    dokumentId: 1,
    nazwaPliku: 'dokument-1.txt',
    typDokumentu: 'wynik',
    opis: 'Opis dokumentu',
    dataUtworzenia: new Date().toISOString(),
    rozmiarPliku: 1200,
    wizytaId: 1,
    pacjentId: 1,
  },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const WizytyLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');
  const [wizyty, setWizyty] = useState<LekarzWizytaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWizytaId, setSelectedWizytaId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [diagnoza, setDiagnoza] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [dokumenty, setDokumenty] = useState<Dokument[]>([]);
  const [dokLoading, setDokLoading] = useState(false);
  const [dokError, setDokError] = useState<string | null>(null);
  const [dokSaving, setDokSaving] = useState(false);
  const [dokMessage, setDokMessage] = useState<string | null>(null);
  const [nowyDokument, setNowyDokument] = useState<{ typDokumentu: string; tresc: string }>({
    typDokumentu: '',
    tresc: '',
  });

  const reloadWizyty = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    if (isDemoMode) {
      setWizyty(mockWizyty);
      if (!silent) {
        setLoading(false);
      }
      return;
    }

    try {
      const data =
        range === 'day'
          ? await apiService.getLekarzWizytyDzien(selectedDate)
          : range === 'week'
            ? await apiService.getLekarzWizytyTydzien(selectedDate)
            : await apiService.getLekarzWizytyMiesiac(selectedDate);
      setWizyty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [isDemoMode, range, selectedDate, t]);

  useEffect(() => {
    reloadWizyty();
  }, [reloadWizyty]);

  useEffect(() => {
    if (!selectedWizytaId && wizyty.length > 0) {
      setSelectedWizytaId(wizyty[0].wizytaId);
      return;
    }

    if (selectedWizytaId && !wizyty.some((w) => w.wizytaId === selectedWizytaId)) {
      setSelectedWizytaId(wizyty[0]?.wizytaId ?? null);
    }
  }, [selectedWizytaId, wizyty]);

  useEffect(() => {
    const current = wizyty.find((w) => w.wizytaId === selectedWizytaId);
    setDiagnoza(current?.diagnoza ?? '');
    setStatusMessage(null);
    setStatusError(null);
    setDokMessage(null);
    setDokError(null);
  }, [selectedWizytaId, wizyty]);

  useEffect(() => {
    const loadDokumenty = async () => {
      if (!isModalOpen || !selectedWizytaId) return;
      setDokLoading(true);
      setDokError(null);
      try {
        if (isDemoMode) {
          setDokumenty(mockDokumenty.filter((d) => d.wizytaId === selectedWizytaId));
        } else {
          const data = await apiService.getDokumentyWizytyLekarz(selectedWizytaId);
          setDokumenty(data);
        }
      } catch (err) {
        setDokError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setDokLoading(false);
      }
    };

    loadDokumenty();
  }, [isModalOpen, selectedWizytaId, isDemoMode, t]);

  const selectedWizyta = useMemo(
    () => wizyty.find((w) => w.wizytaId === selectedWizytaId) || null,
    [selectedWizytaId, wizyty],
  );

  const openModal = (wizytaId: number) => {
    setSelectedWizytaId(wizytaId);
    setIsModalOpen(true);
    setDokMessage(null);
    setDokError(null);
    setStatusMessage(null);
    setStatusError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDokMessage(null);
    setDokError(null);
    setStatusMessage(null);
    setStatusError(null);
    setNowyDokument({ typDokumentu: '', tresc: '' });
  };

  const handleDokInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNowyDokument((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    const normalized = typeof status === 'string' ? status.toLowerCase() : String(status ?? '').toLowerCase();
    if (normalized.includes('zrealizowana') || normalized.includes('odbyta') || normalized.includes('zakoncz')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          {t('doctorVisits.statusCompleted')}
        </span>
      );
    }
    if (normalized.includes('zaplan')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {t('doctorVisits.statusScheduled')}
        </span>
      );
    }
    if (normalized.includes('anul')) {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          {t('doctorVisits.statusCancelled')}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        {status || '-'}
      </span>
    );
  };

  // Stats state
  const [stats, setStats] = useState({ wizyty: 0, pacjenci: 0, dokumentacja: 0 });

  useEffect(() => {
    const loadStats = async () => {
      if (isDemoMode) {
        setStats({ wizyty: mockWizyty.length, pacjenci: 2, dokumentacja: mockDokumenty.length });
        return;
      }
      try {
        const data = await fetchDoctorStats();
        setStats(data);
      } catch (e) {
        console.error('Failed to load stats', e);
      }
    };
    loadStats();
  }, [isDemoMode]);

  const statCards = [
    {
      id: 'wizyty',
      icon: CalendarDaysIcon,
      title: t('doctorDashboard.visits'),
      value: stats.wizyty,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-alimed-blue',
      onClick: () => undefined,
    },
    {
      id: 'pacjenci',
      icon: UsersIcon,
      title: t('doctorDashboard.patients'),
      value: stats.pacjenci,
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-500',
      onClick: () => navigate('/pacjenci-lekarza'),
    },
    {
      id: 'dokumentacja',
      icon: DocumentTextIcon,
      title: t('doctorDashboard.documentation'),
      value: stats.dokumentacja,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-500',
      onClick: () => navigate('/dokumentacja-lekarza'),
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

  // ... (keeping other handlers like handleMarkCompleted, isWizytaZrealizowana, handleCreateDocument) ...
  // Wait, I need to keep those handlers, but I'm editing a chunk. 
  // I will just return the layout change here.

  const handleMarkCompleted = async () => {
    if (!selectedWizyta) return;
    setStatusSaving(true);
    setStatusError(null);
    setStatusMessage(null);
    try {
      await apiService.oznaczWizyteOdbyta(selectedWizyta.wizytaId, diagnoza);
      setStatusMessage(t('doctorVisits.statusUpdated'));
      await reloadWizyty(true);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setStatusSaving(false);
    }
  };

  const isWizytaZrealizowana = (status?: string) => {
    const normalized = String(status ?? '').toLowerCase();
    return normalized.includes('odbyta') || normalized.includes('zrealizowana');
  };

  const handleCreateDocument = async () => {
    if (!selectedWizyta || !nowyDokument.typDokumentu) {
      setDokError(t('doctorVisits.missingDocumentType'));
      return;
    }
    setDokSaving(true);
    setDokError(null);
    setDokMessage(null);
    try {
      const payload: DokumentCreateRequest = {
        wizytaId: selectedWizyta.wizytaId,
        typDokumentu: nowyDokument.typDokumentu,
        tresc: nowyDokument.tresc || undefined,
      };

      if (isDemoMode) {
        const newDoc: Dokument = {
          dokumentId: Math.floor(Math.random() * 100000),
          nazwaPliku: `dokument-${selectedWizyta.wizytaId}.txt`,
          typDokumentu: nowyDokument.typDokumentu,
          opis: '',
          dataUtworzenia: new Date().toISOString(),
          rozmiarPliku: nowyDokument.tresc.length,
          wizytaId: selectedWizyta.wizytaId,
        };
        setDokumenty((prev) => [newDoc, ...prev]);
      } else {
        await apiService.createDokument(payload);
        const data = await apiService.getDokumentyWizytyLekarz(selectedWizyta.wizytaId);
        setDokumenty(data);
      }

      setNowyDokument({ typDokumentu: '', tresc: '' });
      setDokMessage(t('doctorVisits.documentSaved'));
    } catch (err) {
      setDokError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setDokSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {t('common.error')}: {error}
      </div>
    );
  }

  return (
    <div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {t('dashboard.demoNotice')}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.id}
              onClick={card.onClick}
              className="bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-transparent"
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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('doctorVisits.title')}</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRange('day')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${range === 'day'
                    ? 'bg-alimed-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t('doctorVisits.day')}
                </button>
                <button
                  type="button"
                  onClick={() => setRange('week')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${range === 'week'
                    ? 'bg-alimed-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t('doctorVisits.week')}
                </button>
                <button
                  type="button"
                  onClick={() => setRange('month')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${range === 'month'
                    ? 'bg-alimed-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {t('doctorVisits.month')}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500" htmlFor="visit-date">
                  {t('doctorVisits.baseDate')}
                </label>
                <input
                  id="visit-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setSelectedWizytaId(null);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
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
                    key={wizyta.wizytaId}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedWizytaId === wizyta.wizytaId ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => {
                      setSelectedWizytaId(wizyta.wizytaId);
                      openModal(wizyta.wizytaId);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatTime(wizyta.dataWizyty)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {wizyta.pacjent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t('doctorVisits.visitLabel')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(wizyta.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          openModal(wizyta.wizytaId);
                        }}
                        className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                      >
                        {t('doctorVisits.details')}
                      </button>
                    </td>
                  </tr>
                ))}
                {wizyty.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                      {t('doctorVisits.noVisitsDay')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && selectedWizyta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('doctorVisits.visitDetails')}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Zamknij"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{t('doctorVisits.patient')}</h4>
                    <p className="text-lg font-semibold text-gray-900">{selectedWizyta.pacjent}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">{t('doctorVisits.currentVisit')}</h4>
                    <p className="text-sm text-gray-700">
                      {formatDate(selectedWizyta.dataWizyty)} {formatTime(selectedWizyta.dataWizyty)}
                    </p>
                    <div className="mt-2">{getStatusBadge(selectedWizyta.status)}</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <label className="text-sm font-medium text-gray-500" htmlFor="diagnoza">
                    {t('doctorVisits.diagnosisLabel')}
                  </label>
                  <textarea
                    id="diagnoza"
                    value={diagnoza}
                    onChange={(event) => setDiagnoza(event.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    rows={3}
                    placeholder={t('doctorVisits.diagnosisPlaceholder')}
                    readOnly={isWizytaZrealizowana(selectedWizyta.status)}
                    disabled={isDemoMode}
                  />
                  {isWizytaZrealizowana(selectedWizyta.status) && (
                    <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                      {t('doctorVisits.diagnosisReadOnly')}
                    </div>
                  )}
                  {statusError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {statusError}
                    </div>
                  )}
                  {statusMessage && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                      {statusMessage}
                    </div>
                  )}
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-200"
                    onClick={handleMarkCompleted}
                    disabled={
                      statusSaving ||
                      isDemoMode ||
                      isWizytaZrealizowana(selectedWizyta.status)
                    }
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    {statusSaving ? t('doctorVisits.saving') : t('doctorVisits.markAsCompleted')}
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50"
                    onClick={async () => {
                      if (!window.confirm('Czy na pewno oznaczyć nieobecność pacjenta?')) return;
                      setStatusSaving(true);
                      try {
                        await apiService.markWizytaNieobecnosc(selectedWizyta.wizytaId);
                        setStatusMessage('Oznaczono nieobecność.');
                        await reloadWizyty(true);
                        closeModal();
                      } catch (err) {
                        setStatusError(err instanceof Error ? err.message : t('common.error'));
                      } finally {
                        setStatusSaving(false);
                      }
                    }}
                    disabled={
                      statusSaving ||
                      isDemoMode ||
                      isWizytaZrealizowana(selectedWizyta.status)
                    }
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Pacjent nie stawił się
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-700">{t('doctorVisits.visitDocuments')}</h4>
                  </div>

                  {dokError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {dokError}
                    </div>
                  )}
                  {dokMessage && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                      {dokMessage}
                    </div>
                  )}

                  {dokLoading ? (
                    <div className="text-sm text-gray-500">{t('common.loading')}</div>
                  ) : dokumenty.length > 0 ? (
                    <ul className="space-y-2">
                      {dokumenty.map((doc) => (
                        <li key={doc.dokumentId} className="text-sm text-gray-700">
                          {doc.nazwaPliku || `Dokument #${doc.dokumentId}`} · {doc.typDokumentu || 'inne'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500">{t('doctorVisits.noDocuments')}</div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="typDokumentu">
                        {t('doctorVisits.documentType')}
                      </label>
                      <select
                        id="typDokumentu"
                        name="typDokumentu"
                        value={nowyDokument.typDokumentu}
                        onChange={handleDokInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">{t('doctorVisits.selectDocumentType')}</option>
                        <option value="wynik">{t('doctorDocumentation.typeWynik')}</option>
                        <option value="recepta">{t('doctorDocumentation.typeRecepta')}</option>
                        <option value="opis">{t('doctorDocumentation.typeOpis')}</option>
                        <option value="skierowanie">{t('doctorDocumentation.typeSkierowanie')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="tresc">
                        {t('doctorVisits.documentContent')}
                      </label>
                      <textarea
                        id="tresc"
                        name="tresc"
                        value={nowyDokument.tresc}
                        onChange={handleDokInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={4}
                        placeholder={t('doctorVisits.enterDocumentContent')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateDocument}
                      disabled={dokSaving || isDemoMode}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-200"
                    >
                      <DocumentTextIcon className="w-5 h-5" />
                      {dokSaving ? t('doctorVisits.saving') : t('doctorVisits.addDocument')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </main >
    </div >
  );
};

export default WizytyLekarzPage;
