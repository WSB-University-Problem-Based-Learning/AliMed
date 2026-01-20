import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import Card from '../components/Card';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FolderIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';
import type { Dokument, Pacjent, WizytaDetail } from '../types/api';
import { openDocumentPdf } from '../utils/documentPdf';

const DokumentyPage: React.FC = () => {
  const { t } = useTranslation();
  const [dokumenty, setDokumenty] = useState<Dokument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recepty' | 'wyniki' | 'skierowania' | 'inne'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');
  const [pacjentCache, setPacjentCache] = useState<Pacjent | null>(null);

  useEffect(() => {
    const fetchDokumenty = async () => {
      try {
        const data = await apiService.getDokumenty();
        setDokumenty(data);
      } catch {
        // API nie istnieje - użyj mock data dla demo
        console.warn('Dokumenty API not available, using mock data');
        const mockDokumenty: Dokument[] = [
          {
            dokumentId: 1,
            nazwaPliku: 'Wyniki_badania_krwi.pdf',
            typDokumentu: 'wynik',
            opis: 'Morfologia krwi - badanie okresowe',
            dataUtworzenia: '2025-01-15T10:30:00',
            rozmiarPliku: 245760,
          },
          {
            dokumentId: 2,
            nazwaPliku: 'Recepta_20250110.pdf',
            typDokumentu: 'recepta',
            opis: 'Recepta na leki kardiologiczne',
            dataUtworzenia: '2025-01-10T14:20:00',
            rozmiarPliku: 128000,
          },
          {
            dokumentId: 3,
            nazwaPliku: 'Skierowanie_kardiolog.pdf',
            typDokumentu: 'skierowanie',
            opis: 'Skierowanie do kardiologa',
            dataUtworzenia: '2025-01-05T09:15:00',
            rozmiarPliku: 98304,
          },
          {
            dokumentId: 4,
            nazwaPliku: 'RTG_klatki_piersiowej.pdf',
            typDokumentu: 'wynik',
            opis: 'Zdjęcie RTG klatki piersiowej',
            dataUtworzenia: '2024-12-20T11:45:00',
            rozmiarPliku: 1536000,
          },
          {
            dokumentId: 5,
            nazwaPliku: 'Zaswiadczenie_lekarskie.pdf',
            typDokumentu: 'inne',
            opis: 'Zaświadczenie o stanie zdrowia',
            dataUtworzenia: '2024-12-15T16:00:00',
            rozmiarPliku: 76800,
          },
        ];
        setDokumenty(mockDokumenty);
      } finally {
        setLoading(false);
      }
    };

    fetchDokumenty();
  }, [t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      recepta: t('documents.typeRecepta'),
      wynik: t('documents.typeWynik'),
      skierowanie: t('documents.typeSkierowanie'),
      inne: t('documents.typeInne'),
    };
    return types[type.toLowerCase()] || type;
  };

  const filterDokumenty = (docs: Dokument[]) => {
    let filtered = docs;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.typDokumentu?.toLowerCase() === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.nazwaPliku?.toLowerCase().includes(query) ||
        d.opis?.toLowerCase().includes(query)
      );
    }

    // Sort documents
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dataUtworzenia).getTime() - new Date(a.dataUtworzenia).getTime();
        case 'name':
          return (a.nazwaPliku || '').localeCompare(b.nazwaPliku || '');
        case 'type':
          return (a.typDokumentu || '').localeCompare(b.typDokumentu || '');
        default:
          return 0;
      }
    });

    return sorted;
  };

  const formatDocumentName = (name?: string) => {
    if (!name) return '';
    return name.endsWith('.txt') ? name.slice(0, -4) : name;
  };

  const handleDownloadPdf = async (dokument: Dokument) => {
    const popup = window.open('', '_blank');
    if (!popup) {
      alert('Popup zablokowany. Zezwol na otwieranie okien.');
      return;
    }
    try {
      const pacjentPromise = pacjentCache
        ? Promise.resolve(pacjentCache)
        : apiService.getMojProfil().catch(() => undefined);
      const wizytaPromise = dokument.wizytaId
        ? apiService.getWizytaById(dokument.wizytaId).catch(() => undefined)
        : Promise.resolve(undefined);
      const trescPromise = apiService
        .downloadDokument(dokument.dokumentId)
        .then((blob) => blob.text())
        .catch(() => undefined);

      const [pacjent, wizyta, tresc] = await Promise.all([
        pacjentPromise,
        wizytaPromise,
        trescPromise,
      ]);

      if (pacjent && !pacjentCache) {
        setPacjentCache(pacjent);
      }

      openDocumentPdf({
        dokument,
        pacjent: pacjent ?? undefined,
        wizyta: wizyta as WizytaDetail | undefined,
        tresc,
        targetWindow: popup,
      });
    } catch {
      popup.close();
      alert(t('documents.errorDownloading'));
    }
  };

  const filteredDokumenty = filterDokumenty(dokumenty);

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
        <h2 className="text-3xl font-bold text-alimed-blue mb-4">{t('documents.title')}</h2>
        <p className="text-gray-600 mb-6">{t('documents.subtitle')}</p>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('documents.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent appearance-none"
              >
                <option value="all">{t('documents.allTypes')}</option>
                <option value="recepty">{t('documents.typeRecepta')}</option>
                <option value="wyniki">{t('documents.typeWynik')}</option>
                <option value="skierowania">{t('documents.typeSkierowanie')}</option>
                <option value="inne">{t('documents.typeInne')}</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent appearance-none"
              >
                <option value="date">{t('documents.sortByDate')}</option>
                <option value="name">{t('documents.sortByName')}</option>
                <option value="type">{t('documents.sortByType')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <DocumentTextIcon className="h-8 w-8 mx-auto text-alimed-blue mb-2" />
            <p className="text-2xl font-bold text-alimed-blue">{dokumenty.length}</p>
            <p className="text-sm text-gray-600">{t('documents.totalDocuments')}</p>
          </Card>
          <Card className="text-center">
            <FolderIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {dokumenty.filter(d => d.typDokumentu?.toLowerCase() === 'recepty').length}
            </p>
            <p className="text-sm text-gray-600">{t('documents.typeRecepta')}</p>
          </Card>
          <Card className="text-center">
            <DocumentTextIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {dokumenty.filter(d => d.typDokumentu?.toLowerCase() === 'wyniki').length}
            </p>
            <p className="text-sm text-gray-600">{t('documents.typeWynik')}</p>
          </Card>
          <Card className="text-center">
            <DocumentTextIcon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {dokumenty.filter(d => d.typDokumentu?.toLowerCase() === 'skierowania').length}
            </p>
            <p className="text-sm text-gray-600">{t('documents.typeSkierowanie')}</p>
          </Card>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDokumenty.map((dokument) => (
          <Card key={dokument.dokumentId}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-alimed-blue/10 rounded-lg">
                  <DocumentTextIcon className="h-8 w-8 text-alimed-blue" />
                </div>
                
                <div className="flex-1 space-y-2">
                  {/* Document Name */}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDocumentName(dokument.nazwaPliku)}
                  </h3>

                  {/* Document Type and Date */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-alimed-blue/10 text-alimed-blue">
                      {getDocumentTypeLabel(dokument.typDokumentu || 'inne')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(dokument.dataUtworzenia)}
                    </span>
                    {dokument.rozmiarPliku && (
                      <span className="text-gray-600">
                        {formatFileSize(dokument.rozmiarPliku)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {dokument.opis && (
                    <p className="text-sm text-gray-600">{dokument.opis}</p>
                  )}

                  {/* Associated Visit */}
                  {dokument.wizytaId && (
                    <p className="text-xs text-gray-500">
                      {t('documents.relatedToVisit')}: #{dokument.wizytaId}
                    </p>
                  )}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownloadPdf(dokument)}
                className="flex items-center gap-2 px-4 py-2 bg-alimed-blue text-white rounded-lg hover:bg-alimed-light-blue transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Pobierz jako PDF
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDokumenty.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FolderIcon className="h-16 w-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 text-lg">
              {searchQuery || filterType !== 'all'
                ? t('documents.noDocumentsFound')
                : t('documents.noDocuments')}
            </p>
            <p className="text-gray-400 text-sm mt-2">{t('documents.noDocumentsHint')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DokumentyPage;
