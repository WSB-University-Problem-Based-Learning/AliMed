import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Dokument, Pacjent, Wizyta, WizytaDetail } from '../types/api';
import Card from '../components/Card';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { openDocumentPdf } from '../utils/documentPdf';

// Demo mode mock data
const mockWizyty: Wizyta[] = [
  {
    wizytaId: 1,
    dataWizyty: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    czyOdbyta: false,
    lekarz: { lekarzId: 1, imie: 'Jan', nazwisko: 'Nowak', specjalizacja: 'Kardiolog' },
  },
  {
    wizytaId: 2,
    dataWizyty: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    czyOdbyta: false,
    lekarz: { lekarzId: 2, imie: 'Maria', nazwisko: 'Kowalska', specjalizacja: 'Dermatolog' },
  },
  {
    wizytaId: 3,
    dataWizyty: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    czyOdbyta: true,
    diagnoza: 'Badanie kontrolne - wyniki prawidłowe',
    lekarz: { lekarzId: 3, imie: 'Piotr', nazwisko: 'Wiśniewski', specjalizacja: 'Ortopeda' },
  },
  {
    wizytaId: 4,
    dataWizyty: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    czyOdbyta: true,
    diagnoza: 'Zalecono dodatkowe badania',
    lekarz: { lekarzId: 4, imie: 'Anna', nazwisko: 'Zielińska', specjalizacja: 'Internista' },
  },
];

const MojeWizytyPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { isDemoMode } = useAuth();
  const [wizyty, setWizyty] = useState<Wizyta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [selectedWizyta, setSelectedWizyta] = useState<WizytaDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [pacjentCache, setPacjentCache] = useState<Pacjent | null>(null);

  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        if (isDemoMode) {
          // Use mock data in demo mode
          setWizyty(mockWizyty);
        } else {
          const data = await apiService.getWizyty();
          setWizyty(data);
        }
      } catch (err) {
        if (isDemoMode) {
          // Fallback to mock data even on error in demo mode
          setWizyty(mockWizyty);
        } else {
          setError(err instanceof Error ? err.message : t('error.errorOccurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWizyty();
  }, [t, isDemoMode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'szl' ? 'pl-PL' : 'pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'szl' ? 'pl-PL' : 'pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCompletedStatus = (status?: string) => {
    const normalized = (status || '').toLowerCase();
    return normalized === 'odbyta' || normalized === 'zrealizowana';
  };

  const filterWizyty = (wizyty: Wizyta[]) => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return wizyty.filter(w => !isCompletedStatus(w.status) && new Date(w.dataWizyty) >= now);
      case 'completed':
        return wizyty.filter(w => isCompletedStatus(w.status) || new Date(w.dataWizyty) < now);
      default:
        return wizyty;
    }
  };

  const sortedWizyty = [...filterWizyty(wizyty)].sort((a, b) => {
    return new Date(b.dataWizyty).getTime() - new Date(a.dataWizyty).getTime();
  });

  const formatDocumentName = (name?: string) => {
    if (!name) return '';
    return name.endsWith('.txt') ? name.slice(0, -4) : name;
  };

  const handlePreview = async (dokument: Dokument) => {
    const popup = window.open('', '_blank');
    if (!popup) {
      alert('Popup zablokowany. Zezwol na otwieranie okien.');
      return;
    }
    try {
      const pacjentPromise = pacjentCache
        ? Promise.resolve(pacjentCache)
        : apiService.getMojProfil().catch(() => undefined);
      const trescPromise = apiService
        .downloadDokument(dokument.dokumentId)
        .then((blob) => blob.text())
        .catch(() => undefined);

      const [pacjent, tresc] = await Promise.all([pacjentPromise, trescPromise]);

      if (pacjent && !pacjentCache) {
        setPacjentCache(pacjent);
      }

      openDocumentPdf({
        dokument,
        pacjent: pacjent ?? undefined,
        wizyta: selectedWizyta ?? undefined,
        tresc,
        targetWindow: popup,
      });
    } catch (err) {
      popup.close();
      alert(t('documents.errorDownloading'));
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
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-alimed-blue mb-4">{t('myVisits.title')}</h2>
        
        {/* Demo mode notice */}
        {isDemoMode && (
          <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <InformationCircleIcon className="w-6 h-6 text-purple-500 flex-shrink-0" />
              <p className="ml-3 text-sm font-medium text-purple-800">
                {t('patients.demoNotice')}
              </p>
            </div>
          </div>
        )}
        
        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-alimed-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('myVisits.all')}
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'upcoming'
                ? 'bg-alimed-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('myVisits.upcoming')}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-alimed-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('myVisits.completed')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedWizyty.map((wizyta) => {
          const isPast = new Date(wizyta.dataWizyty) < new Date();
          const isCompleted = isCompletedStatus(wizyta.status);
          
          return (
            <Card key={wizyta.wizytaId}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 space-y-3">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-lg font-semibold text-alimed-blue">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{formatDate(wizyta.dataWizyty)}</span>
                    <ClockIcon className="h-5 w-5 ml-2" />
                    <span>{formatTime(wizyta.dataWizyty)}</span>
                  </div>

                  {/* Doctor */}
                  {(wizyta.lekarz || wizyta.lekarzName) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">
                        {t('myVisits.doctor')}: {wizyta.lekarzName || `${wizyta.lekarz!.imie} ${wizyta.lekarz!.nazwisko}`}
                      </span>
                      {(wizyta.specjalizacja || wizyta.lekarzX.specjalizacja) && (
                        <span className="text-sm text-gray-500">
                          ({wizyta.specjalizacja || wizyta.lekarzX.specjalizacja})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Diagnosis */}
                  {wizyta.diagnoza && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{t('myVisits.diagnosis')}:</span> {wizyta.diagnoza}
                    </div>
                  )}

                  {/* Patient info (if available) */}
                  {wizyta.pacjent && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{t('myVisits.patient')}:</span>{' '}
                      {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div className="flex flex-col items-end gap-2">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-4 w-4" />
                      {t('myVisits.statusCompleted')}
                    </span>
                  ) : isPast ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <ClockIcon className="h-4 w-4" />
                      {t('myVisits.statusPast')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <CalendarIcon className="h-4 w-4" />
                      {t('myVisits.statusUpcoming')}
                    </span>
                  )}
                  <button
                    onClick={async () => {
                      setDetailsError(null);
                      setLoadingDetails(true);
                      try {
                        const details = await apiService.getWizytaById(wizyta.wizytaId);
                        setSelectedWizyta(details);
                      } catch (err) {
                        setDetailsError(err instanceof Error ? err.message : t('common.error'));
                      } finally {
                        setLoadingDetails(false);
                      }
                    }}
                    className="text-sm text-alimed-blue hover:underline"
                  >
                    Szczegoly wizyty
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedWizyty.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <XCircleIcon className="h-16 w-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">{t('myVisits.noVisits')}</p>
            <p className="text-gray-400 text-sm mt-2">{t('myVisits.noVisitsHint')}</p>
          </div>
        </Card>
      )}

      {selectedWizyta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-alimed-blue/10 text-alimed-blue flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Szczegoly wizyty</h3>
                  <p className="text-sm text-gray-500">
                    Sprawdz informacje, dokumenty i pobierz PDF.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWizyta(null)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Zamknij
              </button>
            </div>
            <div className="p-6 space-y-6">
              {detailsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {detailsError}
                </div>
              )}
              {loadingDetails ? (
                <div className="text-gray-500">Ladowanie...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                      <div className="text-xs uppercase tracking-wide text-gray-400">Termin wizyty</div>
                      <div className="text-base font-semibold text-gray-900">
                        {formatDate(selectedWizyta.dataWizyty)} · {formatTime(selectedWizyta.dataWizyty)}
                      </div>
                      <div><span className="text-gray-500">Status:</span> {selectedWizyta.status}</div>
                      <div><span className="text-gray-500">Placowka:</span> {selectedWizyta.placowka}</div>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 space-y-2">
                      <div className="text-xs uppercase tracking-wide text-gray-400">Lekarz</div>
                      <div className="text-base font-semibold text-gray-900">
                        {selectedWizyta.lekarz} ({selectedWizyta.specjalizacja})
                      </div>
                      {selectedWizyta.diagnoza ? (
                        <div>
                          <span className="text-gray-500">Diagnoza:</span> {selectedWizyta.diagnoza}
                        </div>
                      ) : (
                        <div className="text-gray-400">Diagnoza nie zostala jeszcze uzupelniona.</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Dokumenty z wizyty</h4>
                        <p className="text-sm text-gray-500">Kliknij, aby pobrac dokument w PDF.</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {selectedWizyta.dokumenty.length} plikow
                      </span>
                    </div>
                    {selectedWizyta.dokumenty.length > 0 ? (
                      <div className="space-y-2">
                        {selectedWizyta.dokumenty.map((d: Dokument) => (
                          <div
                            key={d.dokumentId}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                          >
                            <div className="text-sm text-gray-700">
                              <div className="font-medium text-gray-900">
                                {formatDocumentName(d.nazwaPliku) || `Dokument #${d.dokumentId}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                Typ: {d.typDokumentu || 'inne'}
                              </div>
                            </div>
                            <button
                              onClick={() => handlePreview(d)}
                              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-alimed-blue bg-alimed-blue/10 rounded-lg hover:bg-alimed-blue/20 transition"
                            >
                              Pobierz jako PDF
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Brak dokumentow. Pojawia sie po zakonczonej wizycie.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MojeWizytyPage;
