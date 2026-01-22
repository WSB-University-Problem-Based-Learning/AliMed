import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    EnvelopeIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ArrowLeftIcon,
    XMarkIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { LekarzPacjentDetails, Dokument } from '../types/api';

const DoctorPatientDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { isDemoMode } = useAuth();
    const navigate = useNavigate();

    const [pacjent, setPacjent] = useState<LekarzPacjentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWizyta, setSelectedWizyta] = useState<NonNullable<LekarzPacjentDetails['wizyty']>[number] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAddDoc, setShowAddDoc] = useState(false);
    const [docForm, setDocForm] = useState({ typDokumentu: '', tresc: '' });
    const [docSubmitting, setDocSubmitting] = useState(false);
    const [docError, setDocError] = useState<string | null>(null);
    const [docSuccess, setDocSuccess] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<Dokument | null>(null);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) return;

            try {
                setLoading(true);
                if (isDemoMode) {
                    // Mock
                    setPacjent({
                        pacjentId: Number(id),
                        imie: 'Jan',
                        nazwisko: 'Kowalski',
                        pesel: '12345678901',
                        dataUrodzenia: '1980-01-01',
                        email: 'jan@example.com',
                        adresZamieszkania: {
                            miasto: 'Warszawa',
                            ulica: 'Prosta',
                            numerDomu: '1'
                        },
                        wizyty: []
                    });
                } else {
                    const data = await apiService.getLekarzPacjentById(Number(id));
                    setPacjent(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : t('common.error'));
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, isDemoMode, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
            </div>
        );
    }

    if (error || !pacjent) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-12">
                <div className="text-red-500 text-xl">{error || t('common.error')}</div>
                <button onClick={() => navigate(-1)} className="text-alimed-blue hover:underline">
                    {t('common.goBack')}
                </button>
            </div>
        );
    }

    const formatDate = (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('pl-PL');
    };

    const formatDateTime = (value: string) => {
        const date = new Date(value);
        return date.toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const wizyty = pacjent.wizyty ?? [];
    const selectedDokumentyCount = selectedWizyta?.dokumenty?.length ?? 0;
    const hasSelectedDokumenty = selectedDokumentyCount > 0;

    const isWizytaZrealizowana = (status?: string) => {
        const normalized = (status || '').toLowerCase();
        return normalized.includes('zrealiz') || normalized.includes('odby');
    };

    const getStatusBadge = (status?: string) => {
        const normalized = (status || '').toLowerCase();
        if (normalized.includes('zrealiz') || normalized.includes('odby')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    {status}
                </span>
            );
        }
        if (normalized.includes('anul')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="h-3.5 w-3.5" />
                    {status}
                </span>
            );
        }
        if (normalized.includes('nieobec')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {status}
                </span>
            );
        }
        if (normalized.includes('zaplan')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {status}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {status || '-'}
            </span>
        );
    };

    const openWizytaModal = (wizyta: NonNullable<LekarzPacjentDetails['wizyty']>[number]) => {
        setSelectedWizyta(wizyta);
        setIsModalOpen(true);
        setDocError(null);
        setDocSuccess(null);
        setDocForm({ typDokumentu: '', tresc: '' });
        setShowAddDoc(false);
        setPreviewDoc(null);
        setPreviewContent(null);
        setPreviewError(null);
    };

    const closeWizytaModal = () => {
        setIsModalOpen(false);
        setSelectedWizyta(null);
        setDocError(null);
        setDocSuccess(null);
        setDocSubmitting(false);
        setShowAddDoc(false);
        setPreviewDoc(null);
        setPreviewContent(null);
        setPreviewError(null);
    };

    const updateWizytaDokumenty = (wizytaId: number, dokumenty: Dokument[]) => {
        setPacjent((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                wizyty: prev.wizyty?.map((w) =>
                    w.wizytaId === wizytaId ? { ...w, dokumenty } : w
                ),
            };
        });
        setSelectedWizyta((prev) => (prev && prev.wizytaId === wizytaId ? { ...prev, dokumenty } : prev));
    };

    const handleDocInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDocForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddDokument = async () => {
        if (!selectedWizyta) return;
        if (!docForm.typDokumentu) {
            setDocError(t('doctorDocumentation.selectVisitAndType'));
            return;
        }
        try {
            setDocSubmitting(true);
            setDocError(null);
            await apiService.createDokument({
                wizytaId: selectedWizyta.wizytaId,
                typDokumentu: docForm.typDokumentu,
                tresc: docForm.tresc || undefined,
            });
            const docs = await apiService.getDokumentyWizytyLekarz(selectedWizyta.wizytaId);
            updateWizytaDokumenty(selectedWizyta.wizytaId, docs);
            setDocSuccess(t('doctorDocumentation.documentSaved'));
            setDocForm({ typDokumentu: '', tresc: '' });
        } catch (err) {
            setDocError(err instanceof Error ? err.message : t('doctorDocumentation.documentSaveError'));
        } finally {
            setDocSubmitting(false);
        }
    };

    const handlePreviewDokument = async (dokument: Dokument) => {
        setPreviewDoc(dokument);
        setPreviewContent(null);
        setPreviewError(null);
        setPreviewLoading(true);
        try {
            const blob = await apiService.downloadDokument(dokument.dokumentId);
            const text = await blob.text();
            setPreviewContent(text || null);
        } catch (err) {
            setPreviewError(err instanceof Error ? err.message : t('doctorDocumentation.errorDownloading'));
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div>
            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/pacjenci-lekarza')}
                    className="flex items-center gap-2 text-gray-600 hover:text-alimed-blue mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('common.goBack')}
                </button>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header z danymi pacjenta */}
                    <div className="px-6 py-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <UserCircleIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {pacjent.imie} {pacjent.nazwisko}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-500">PESEL:</span>
                                        <span>{pacjent.pesel}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-500">{t('register.birthDate')}:</span>
                                        <span>{new Date(pacjent.dataUrodzenia).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Szczegóły kontaktu i adresu */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                {t('doctorMyData.contact')}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                    <span>{pacjent.email || '-'}</span>
                                </div>
                                {/* Telefon jeśli dostępny w modelu, na razie brak w interfejsie Pacjent */}
                                {/* <div className="flex items-center gap-3 text-gray-700">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <span>{'-'}</span>
                </div> */}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                {t('doctorMyData.address')}
                            </h3>
                            <div className="flex items-start gap-3 text-gray-700">
                                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    {pacjent.adresZamieszkania ? (
                                        <>
                                            <p>{pacjent.adresZamieszkania.ulica} {pacjent.adresZamieszkania.numerDomu}</p>
                                            <p>{pacjent.adresZamieszkania.kodPocztowy} {pacjent.adresZamieszkania.miasto}</p>
                                        </>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tu można dodać sekcję Historia Wizyt i Dokumentacja w przyszłości */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarDaysIcon className="w-6 h-6 text-alimed-blue" />
                            <h3 className="text-lg font-semibold text-gray-900">{t('doctorVisits.title')}</h3>
                        </div>
                        {wizyty.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">{t('common.noData')}</p>
                        ) : (
                            <ul className="space-y-4">
                                {wizyty.map((wizyta) => (
                                    <li key={wizyta.wizytaId} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateTime(wizyta.dataWizyty)}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    {t('doctorVisits.status')}: {getStatusBadge(wizyta.status)}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {t('doctorVisits.visitDocuments')}: {wizyta.dokumenty?.length ?? 0}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-700">
                                            <span className="font-medium">{t('myVisits.diagnosis')}:</span>{' '}
                                            {wizyta.diagnoza || '-'}
                                        </p>
                                        {isWizytaZrealizowana(wizyta.status) && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openWizytaModal(wizyta)}
                                                    className="px-3 py-2 rounded-lg bg-alimed-blue/10 text-alimed-blue text-sm font-medium hover:bg-alimed-blue/20 transition"
                                                >
                                                    {t('doctorVisits.details')}
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </main>
            {isModalOpen && selectedWizyta && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{t('doctorVisits.visitDetails')}</h3>
                                <p className="text-sm text-gray-500">
                                    {formatDateTime(selectedWizyta.dataWizyty)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeWizytaModal}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label={t('visitDetails.close')}
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                                    <div className="text-xs uppercase tracking-wide text-gray-400">{t('visitDetails.visitDate')}</div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {formatDateTime(selectedWizyta.dataWizyty)}
                                    </div>
                                    <div><span className="text-gray-500">{t('visitDetails.status')}:</span> {selectedWizyta.status || '-'}</div>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 space-y-2">
                                    <div className="text-xs uppercase tracking-wide text-gray-400">{t('visitDetails.diagnosis')}</div>
                                    {selectedWizyta.diagnoza ? (
                                        <div className="text-gray-900">{selectedWizyta.diagnoza}</div>
                                    ) : (
                                        <div className="text-gray-400">{t('visitDetails.noDiagnosis')}</div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-100 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t('doctorDocumentation.title')}</h4>
                                        <p className="text-sm text-gray-500">{t('doctorDocumentation.documentList')}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                {selectedDokumentyCount} {t('visitDetails.files')}
                            </span>
                        </div>
                                {hasSelectedDokumenty ? (
                                    <div className="space-y-2">
                                        {selectedWizyta.dokumenty?.map((dokument) => (
                                            <div
                                                key={dokument.dokumentId}
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                                            >
                                                <div className="text-sm text-gray-700">
                                                    <div className="font-medium text-gray-900">
                                                        {dokument.nazwaPliku || `Dokument #${dokument.dokumentId}`}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {t('visitDetails.type')}: {dokument.typDokumentu || 'inne'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{formatDate(dokument.dataUtworzenia)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreviewDokument(dokument)}
                                                        className="px-2.5 py-1 rounded-md bg-alimed-blue/10 text-alimed-blue text-xs font-medium hover:bg-alimed-blue/20 transition"
                                                    >
                                                        {t('doctorDocumentation.preview')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 space-y-2">
                                        <p>{t('doctorDocumentation.noDocuments')}</p>
                                        <p>{t('doctorDocumentation.noDocumentsPrompt')}</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddDoc(true)}
                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-alimed-blue/10 text-alimed-blue text-sm font-medium hover:bg-alimed-blue/20 transition"
                                        >
                                            {t('doctorDocumentation.addDocument')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {(hasSelectedDokumenty || showAddDoc) && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddDoc((prev) => !prev)}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        {showAddDoc ? t('common.cancel') : t('doctorDocumentation.addDocument')}
                                    </button>
                                </div>
                            )}

                            {showAddDoc && (
                                <div className="rounded-xl border border-gray-100 p-4 space-y-4">
                                    <h4 className="font-semibold text-gray-900">{t('doctorDocumentation.addDocument')}</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {t('doctorDocumentation.documentType')}
                                        </label>
                                        <select
                                            name="typDokumentu"
                                            value={docForm.typDokumentu}
                                            onChange={handleDocInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        >
                                            <option value="">{t('doctorDocumentation.selectDocumentType')}</option>
                                            <option value="wynik">{t('doctorDocumentation.typeWynik')}</option>
                                            <option value="recepta">{t('doctorDocumentation.typeRecepta')}</option>
                                            <option value="opis">{t('doctorDocumentation.typeOpis')}</option>
                                            <option value="skierowanie">{t('doctorDocumentation.typeSkierowanie')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {t('doctorDocumentation.documentContent')}
                                        </label>
                                        <textarea
                                            name="tresc"
                                            value={docForm.tresc}
                                            onChange={handleDocInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            rows={4}
                                            placeholder={t('doctorDocumentation.enterDocumentContent')}
                                        />
                                    </div>
                                    {docError && (
                                        <div className="text-sm text-red-600">{docError}</div>
                                    )}
                                    {docSuccess && (
                                        <div className="text-sm text-green-600">{docSuccess}</div>
                                    )}
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={handleAddDokument}
                                            className="px-4 py-2 rounded-lg bg-alimed-blue text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
                                            disabled={docSubmitting}
                                        >
                                            {docSubmitting ? t('common.loading') : t('doctorDocumentation.saveDocument')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{t('doctorDocumentation.preview')}</h3>
                                <p className="text-sm text-gray-500">{previewDoc.nazwaPliku || `Dokument #${previewDoc.dokumentId}`}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewDoc(null);
                                    setPreviewContent(null);
                                    setPreviewError(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label={t('visitDetails.close')}
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {previewLoading ? (
                                <div className="text-gray-500">{t('common.loading')}</div>
                            ) : previewError ? (
                                <div className="text-red-600 text-sm">{previewError}</div>
                            ) : (
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    {previewContent || t('doctorDocumentation.noDocuments')}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPatientDetailsPage;
