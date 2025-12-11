import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Wizyta } from '../types/api';
import Card from '../components/Card';
import { useTranslation } from '../context/LanguageContext';
import { CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const MojeWizytyPage: React.FC = () => {
  const { t, language } = useTranslation();
  const [wizyty, setWizyty] = useState<Wizyta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        const data = await apiService.getWizyty();
        setWizyty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchWizyty();
  }, [t]);

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

  const filterWizyty = (wizyty: Wizyta[]) => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return wizyty.filter(w => !w.czyOdbyta && new Date(w.dataWizyty) >= now);
      case 'completed':
        return wizyty.filter(w => w.czyOdbyta || new Date(w.dataWizyty) < now);
      default:
        return wizyty;
    }
  };

  const sortedWizyty = [...filterWizyty(wizyty)].sort((a, b) => {
    return new Date(b.dataWizyty).getTime() - new Date(a.dataWizyty).getTime();
  });

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
          const isCompleted = wizyta.czyOdbyta;
          
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
                  {wizyta.lekarz && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">
                        {t('myVisits.doctor')}: {wizyta.lekarz.imie} {wizyta.lekarz.nazwisko}
                      </span>
                      {wizyta.lekarz.specjalizacja && (
                        <span className="text-sm text-gray-500">
                          ({wizyta.lekarz.specjalizacja})
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
    </div>
  );
};

export default MojeWizytyPage;
