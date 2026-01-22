import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Dokument, Pacjent, User, Wizyta, WizytaDetail } from '../types/api';
import { apiService } from '../services/api';
import { openDocumentPdf } from '../utils/documentPdf';

const DashboardPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user: authUser, isDemoMode } = useAuth();
  const [wizyty, setWizyty] = useState<Wizyta[]>([]);
  const [loading, setLoading] = useState(true);
  const user: User | null = authUser ?? null;
  const [selectedWizyta, setSelectedWizyta] = useState<WizytaDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [pacjentCache, setPacjentCache] = useState<Pacjent | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        setLoading(true);
        const data = await apiService.getWizyty();
        // Filter only upcoming visits
        const now = new Date();
    const isCancelled = (status?: string) => (status || '').toLowerCase().includes('anul');
    const upcomingWizyty = data.filter(w =>
      !w.czyOdbyta && !isCancelled(w.status) && new Date(w.dataWizyty) >= now
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

  const formatDocumentName = (name?: string) => {
    if (!name) return '';
    return name.endsWith('.txt') ? name.slice(0, -4) : name;
  };

  const isCancelableStatus = (status?: string) => {
    const normalized = (status || '').toLowerCase();
    return (
      !normalized.includes('zrealiz') &&
      !normalized.includes('odby') &&
      !normalized.includes('anul')
    );
  };

  const handlePreview = async (dokument: Dokument) => {
    const popup = window.open('', '_blank');
    if (!popup) {
      alert(t('visitDetails.popupBlocked'));
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
    } catch {
      popup.close();
      alert(t('documents.errorDownloading'));
    }
  };

  const handleCancelVisit = async () => {
    if (!selectedWizyta) return;
    setDetailsError(null);
    setCancelLoading(true);
    try {
      await apiService.cancelWizyta(selectedWizyta.wizytaId);
      setWizyty((prev) => prev.filter((w) => w.wizytaId !== selectedWizyta.wizytaId));
      setSelectedWizyta(null);
      setIsCancelConfirmOpen(false);
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 2000);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setCancelLoading(false);
    }
  };


  // Header and outer wrapper removed to rely on Layout


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

  return (
    <div>
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
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition text-left w-full"
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
                      {wizyta.lekarzName
                        || (wizyta.lekarz ? `${wizyta.lekarz.imie} ${wizyta.lekarz.nazwisko}` : '-')}
                    </td>
                    <td className="py-4 text-gray-600">
                      {wizyta.specjalizacja || wizyta.lekarz?.specjalizacja || '-'}
                    </td>
                    <td className="py-4 text-gray-600">
                      {typeof wizyta.placowka === 'string' ? wizyta.placowka : wizyta.placowka?.nazwa || '-'}
                    </td>
                    <td className="py-4">
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

      {selectedWizyta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-alimed-blue/10 text-alimed-blue flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('visitDetails.title')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('visitDetails.checkInfo')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWizyta(null)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {t('visitDetails.close')}
              </button>
            </div>
            <div className="p-6 space-y-6">
              {detailsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                  {detailsError}
                </div>
              )}
              {loadingDetails ? (
                <div className="text-gray-500">{t('common.loading')}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                      <div className="text-xs uppercase tracking-wide text-gray-400">{t('visitDetails.visitDate')}</div>
                      <div className="text-base font-semibold text-gray-900">
                        {formatDate(selectedWizyta.dataWizyty)} · {formatTime(selectedWizyta.dataWizyty)}
                      </div>
                      <div><span className="text-gray-500">{t('visitDetails.status')}:</span> {selectedWizyta.status}</div>
                      <div><span className="text-gray-500">{t('visitDetails.facility')}:</span> {selectedWizyta.placowka}</div>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 space-y-2">
                      <div className="text-xs uppercase tracking-wide text-gray-400">{t('visitDetails.doctor')}</div>
                      <div className="text-base font-semibold text-gray-900">
                        {selectedWizyta.lekarz} ({selectedWizyta.specjalizacja})
                      </div>
                      {selectedWizyta.diagnoza ? (
                        <div>
                          <span className="text-gray-500">{t('visitDetails.diagnosis')}:</span> {selectedWizyta.diagnoza}
                        </div>
                      ) : (
                        <div className="text-gray-400">{t('visitDetails.noDiagnosis')}</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{t('visitDetails.documents')}</h4>
                        <p className="text-sm text-gray-500">{t('visitDetails.clickToDownload')}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {selectedWizyta.dokumenty.length} {t('visitDetails.files')}
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
                                {t('visitDetails.type')}: {d.typDokumentu || 'inne'}
                              </div>
                            </div>
                            <button
                              onClick={() => handlePreview(d)}
                              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-alimed-blue bg-alimed-blue/10 rounded-lg hover:bg-alimed-blue/20 transition"
                            >
                              {t('visitDetails.downloadPdf')}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {t('visitDetails.noDocuments')}
                      </div>
                    )}
                  </div>

                  {isCancelableStatus(selectedWizyta.status) && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCancelConfirmOpen(true)}
                        className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isCancelConfirmOpen && selectedWizyta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{t('common.confirmCancelVisitTitle')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('common.confirmCancelVisitMessage')}</p>
            </div>
            <div className="p-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsCancelConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
                disabled={cancelLoading}
              >
                {t('common.no')}
              </button>
              <button
                type="button"
                onClick={handleCancelVisit}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium disabled:opacity-60"
                disabled={cancelLoading}
              >
                {cancelLoading ? t('common.loading') : t('common.yes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('common.cancelSuccessTitle')}</h3>
            <p className="text-gray-600">{t('common.cancelSuccessMessage')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
