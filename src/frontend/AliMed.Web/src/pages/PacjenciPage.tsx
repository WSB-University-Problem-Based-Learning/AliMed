import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Pacjent } from '../types/api';
import Card from '../components/Card';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const PacjenciPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user, isDemoMode } = useAuth();
  const [pacjenci, setPacjenci] = useState<Pacjent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has admin/staff role (role > 0)
  const isStaff = user?.role && user.role > 0;

  useEffect(() => {
    const fetchPacjenci = async () => {
      // Only fetch if user is staff
      if (!isStaff && !isDemoMode) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await apiService.getPacjenci();
        setPacjenci(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchPacjenci();
  }, [t, isStaff, isDemoMode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  // Show access denied for non-staff users (unless in demo mode)
  if (!isStaff && !isDemoMode) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShieldExclamationIcon className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('patients.accessDenied')}</h2>
        <p className="text-gray-600 text-center max-w-md">
          {t('patients.accessDeniedDesc')}
        </p>
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
      <h2 className="text-3xl font-bold text-alimed-blue mb-6">{t('patients.title')}</h2>
      
      {isDemoMode && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            {t('patients.demoNotice')}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacjenci.map((pacjent) => (
          <Card key={pacjent.pacjentId}>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {pacjent.imie} {pacjent.nazwisko}
              </p>
              <p className="text-sm text-gray-600">{t('patients.pesel')}: {pacjent.pesel}</p>
              <p className="text-sm text-gray-600">
                {t('patients.birthDate')}: {new Date(pacjent.dataUrodzenia).toLocaleDateString(language === 'szl' ? 'pl-PL' : 'pl-PL')}
              </p>
              {pacjent.adresZamieszkania && (
                <div className="text-sm text-gray-600 mt-3">
                  <p className="font-medium">{t('patients.address')}:</p>
                  <p>
                    {pacjent.adresZamieszkania.ulica} {pacjent.adresZamieszkania.numerDomu}
                  </p>
                  <p>
                    {pacjent.adresZamieszkania.kodPocztowy} {pacjent.adresZamieszkania.miasto}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {pacjenci.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">{t('patients.noPatients')}</p>
        </Card>
      )}
    </div>
  );
};

export default PacjenciPage;
