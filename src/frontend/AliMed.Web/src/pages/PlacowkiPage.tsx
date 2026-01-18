import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Placowka } from '../types/api';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BuildingOffice2Icon, MapPinIcon, PhoneIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Demo mode mock data
const mockPlacowki: Placowka[] = [
  {
    placowkaId: 1,
    nazwa: 'AliMed Centrum Medyczne',
    adresPlacowki: {
      ulica: 'Aleje Jerozolimskie',
      numerDomu: '123',
      kodPocztowy: '00-001',
      miasto: 'Warszawa',
    },
  },
  {
    placowkaId: 2,
    nazwa: 'AliMed Przychodnia Specjalistyczna',
    adresPlacowki: {
      ulica: 'ul. Marszałkowska',
      numerDomu: '45',
      kodPocztowy: '00-002',
      miasto: 'Warszawa',
    },
  },
  {
    placowkaId: 3,
    nazwa: 'AliMed Klinika Kraków',
    adresPlacowki: {
      ulica: 'ul. Floriańska',
      numerDomu: '12',
      kodPocztowy: '31-019',
      miasto: 'Kraków',
    },
  },
  {
    placowkaId: 4,
    nazwa: 'AliMed Przychodnia Gdańsk',
    adresPlacowki: {
      ulica: 'ul. Długa',
      numerDomu: '78',
      kodPocztowy: '80-831',
      miasto: 'Gdańsk',
    },
  },
  {
    placowkaId: 5,
    nazwa: 'AliMed Centrum Wrocław',
    adresPlacowki: {
      ulica: 'Rynek',
      numerDomu: '15',
      kodPocztowy: '50-102',
      miasto: 'Wrocław',
    },
  },
];

const PlacowkiPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useAuth();
  const [placowki, setPlacowki] = useState<Placowka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlacowki = async () => {
      try {
        if (isDemoMode) {
          // Use mock data in demo mode
          setPlacowki(mockPlacowki);
        } else {
          const data = await apiService.getPlacowki();
          setPlacowki(data);
        }
      } catch (err) {
        if (isDemoMode) {
          // Fallback to mock data even on error in demo mode
          setPlacowki(mockPlacowki);
        } else {
          setError(err instanceof Error ? err.message : t('error.errorOccurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlacowki();
  }, [t, isDemoMode]);

  const filteredPlacowki = placowki.filter((placowka) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      placowka.nazwa?.toLowerCase().includes(searchLower) ||
      placowka.adresPlacowki?.miasto?.toLowerCase().includes(searchLower) ||
      placowka.adresPlacowki?.ulica?.toLowerCase().includes(searchLower)
    );
  });

  const formatAddress = (placowka: Placowka) => {
    const adres = placowka.adresPlacowki;
    if (!adres) return t('facilities.noAddress');
    return `${adres.ulica || ''} ${adres.numerDomu || ''}, ${adres.kodPocztowy || ''} ${adres.miasto || ''}`;
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
        <h2 className="text-3xl font-bold text-alimed-blue mb-2">{t('facilities.title')}</h2>
        <p className="text-gray-600">{t('facilities.subtitle')}</p>
      </div>

      {/* Demo mode notice */}
      {isDemoMode && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <InformationCircleIcon className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <p className="ml-3 text-sm font-medium text-purple-800">
              {t('patients.demoNotice')}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('facilities.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
        />
      </div>

      {/* Facilities list */}
      {filteredPlacowki.length === 0 ? (
        <div className="text-center py-12">
          <BuildingOffice2Icon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{t('facilities.noFacilities')}</h3>
          <p className="mt-2 text-gray-500">{searchTerm ? t('facilities.noSearchResults') : t('facilities.noFacilitiesDesc')}</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            {t('facilities.totalFacilities')}: <span className="font-semibold">{filteredPlacowki.length}</span>
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlacowki.map((placowka) => (
              <div
                key={placowka.placowkaId}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-alimed-blue/10 rounded-xl flex items-center justify-center">
                      <BuildingOffice2Icon className="w-6 h-6 text-alimed-blue" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {placowka.nazwa || t('facilities.unnamed')}
                    </h3>
                    <div className="mt-2 flex items-start gap-2 text-gray-600">
                      <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{formatAddress(placowka)}</span>
                    </div>
                    {placowka.numerKonta && (
                      <div className="mt-2 flex items-center gap-2 text-gray-600">
                        <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{placowka.numerKonta}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlacowkiPage;
