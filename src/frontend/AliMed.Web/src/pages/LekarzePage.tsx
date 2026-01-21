import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { apiService } from '../services/api';
import type { Lekarz } from '../types/api';
import Card from '../components/Card';
import { UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const LekarzePage: React.FC = () => {
  const { t } = useTranslation();
  const [lekarze, setLekarze] = useState<Lekarz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSpecjalizacja, setFilterSpecjalizacja] = useState<string>('all');

  useEffect(() => {
    const fetchLekarze = async () => {
      try {
        const data = await apiService.getLekarze();
        setLekarze(data);
      } catch (err) {
        console.error('Error loading doctors:', err);
        setError(t('doctors.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchLekarze();
  }, [t]);

  const getUniqueSpecjalizacje = (): string[] => {
    const specjalizacje = lekarze
      .map(l => l.specjalizacja)
      .filter((s): s is string => !!s);
    return Array.from(new Set(specjalizacje));
  };

  const filteredLekarze = filterSpecjalizacja === 'all'
    ? lekarze
    : lekarze.filter(l => l.specjalizacja === filterSpecjalizacja);

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
        <h2 className="text-3xl font-bold text-alimed-blue mb-4">{t('doctors.title')}</h2>
        <p className="text-gray-600 mb-6">{t('doctors.subtitle')}</p>

        {/* Filter by specialization */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('bookVisit.specialization')}
          </label>
          <select
            value={filterSpecjalizacja}
            onChange={(e) => setFilterSpecjalizacja(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
          >
            <option value="all">{t('bookVisit.allSpecializations')}</option>
            {getUniqueSpecjalizacje().map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredLekarze.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-500">
            {t('doctors.noDoctors')}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLekarze.map((lekarz) => (
            <Card key={lekarz.lekarzId}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-alimed-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-alimed-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t('doctors.doctorPrefix')} {lekarz.imie} {lekarz.nazwisko}
                  </h3>
                  {lekarz.specjalizacja && (
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span>{lekarz.specjalizacja}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-gray-500 text-sm">
        {t('doctors.totalDoctors')}: {filteredLekarze.length}
      </div>
    </div>
  );
};

export default LekarzePage;
