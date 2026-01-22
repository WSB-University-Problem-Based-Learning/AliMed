import React, { useState, useEffect } from 'react';
import {
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { LekarzProfil } from '../types/api';

const MojeDaneLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useAuth();

  const [profil, setProfil] = useState<LekarzProfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        setError(null);
        if (isDemoMode) {
          setProfil({
            lekarzId: 1,
            imie: 'Anna',
            nazwisko: 'Kowalska',
            specjalizacja: 'Internista',
            email: 'anna.kowalska@example.com',
          });
        } else {
          const data = await apiService.getLekarzProfil();
          setProfil(data);
        }
      } catch (err) {
        console.error(err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, [isDemoMode, t]);

  // Header and outer wrapper removed to use common Layout
  // const userName unused


  return (
    <div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {t('dashboard.demoNotice')}
          </div>
        )}

        {/* Moje dane section */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('doctorMyData.title')}
        </h2>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-start gap-3">
            <InformationCircleIcon className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Informacja</p>
              <p className="text-sm mt-1">
                Twoje dane są zarządzane przez administratora systemu. W przypadku konieczności zmiany danych (np. specjalizacja, nazwisko), prosimy o kontakt z działem administracji.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.firstName')}</label>
              <p className="text-lg font-medium text-gray-900">{loading ? t('common.loading') : (profil?.imie || '-')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.lastName')}</label>
              <p className="text-lg font-medium text-gray-900">{loading ? t('common.loading') : (profil?.nazwisko || '-')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.email')}</label>
              <p className="text-lg font-medium text-gray-900">{loading ? t('common.loading') : (profil?.email || '-')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">{t('doctorMyData.specialization')}</label>
              <p className="text-lg font-medium text-gray-900">
                {loading ? t('common.loading') : (profil?.specjalizacja || '-')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MojeDaneLekarzPage;
