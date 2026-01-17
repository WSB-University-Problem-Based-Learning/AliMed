import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Pacjent } from '../types/api';
import Card from '../components/Card';
import { useTranslation } from '../context/LanguageContext';

const PacjenciPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [pacjenci, setPacjenci] = useState<Pacjent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacjenci = async () => {
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
  }, [t]);

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
      <h2 className="text-3xl font-bold text-alimed-blue mb-6">{t('patients.title')}</h2>
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
                    {pacjent.adresZamieszkania.numerMieszkania && `/${pacjent.adresZamieszkania.numerMieszkania}`}
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
