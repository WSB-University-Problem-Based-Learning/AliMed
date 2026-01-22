import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    EnvelopeIcon,
    MapPinIcon,
    CalendarDaysIcon,
    DocumentTextIcon,
    ArrowLeftIcon
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
    const dokumenty: Array<Dokument & { dataWizyty?: string }> = wizyty.flatMap((wizyta) =>
        (wizyta.dokumenty ?? []).map((dokument) => ({
            ...dokument,
            wizytaId: wizyta.wizytaId,
            dataWizyty: wizyta.dataWizyty,
            pacjentId: pacjent.pacjentId,
        })),
    );
    const dokumentySorted = [...dokumenty].sort(
        (a, b) => new Date(b.dataUtworzenia).getTime() - new Date(a.dataUtworzenia).getTime(),
    );

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
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                    {t('doctorVisits.status')}: {wizyta.status || '-'}
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
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DocumentTextIcon className="w-6 h-6 text-alimed-blue" />
                            <h3 className="text-lg font-semibold text-gray-900">{t('doctorDocumentation.title')}</h3>
                        </div>
                        {dokumentySorted.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">{t('doctorDocumentation.noDocuments')}</p>
                        ) : (
                            <ul className="space-y-4">
                                {dokumentySorted.map((dokument) => (
                                    <li key={dokument.dokumentId} className="border border-gray-100 rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {dokument.nazwaPliku || `${t('doctorDocumentation.type')}: ${dokument.typDokumentu || '-'}`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(dokument.dataUtworzenia)}
                                                    {dokument.dataWizyty ? ` \u2022 ${t('doctorVisits.visit')}: ${formatDateTime(dokument.dataWizyty)}` : ''}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {dokument.typDokumentu || '-'}
                                            </span>
                                        </div>
                                        {dokument.opis && (
                                            <p className="mt-2 text-sm text-gray-700">{dokument.opis}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default DoctorPatientDetailsPage;
