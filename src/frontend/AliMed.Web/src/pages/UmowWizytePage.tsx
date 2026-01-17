import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { apiService } from '../services/api';
import type { Lekarz, WizytaCreateRequest, DostepneTerminyResponse } from '../types/api';

const UmowWizytePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lekarze, setLekarze] = useState<Lekarz[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedLekarz, setSelectedLekarz] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSpecjalizacja, setSelectedSpecjalizacja] = useState('all');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    loadLekarze();
  }, []);

  const loadLekarze = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLekarze();
      setLekarze(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
      setError(t('bookVisit.errorLoadingDoctors'));
    } finally {
      setLoading(false);
    }
  };

  const getUniqueSpecjalizacje = (): string[] => {
    const specjalizacje = lekarze
      .map(l => l.specjalizacja)
      .filter((s): s is string => !!s);
    return Array.from(new Set(specjalizacje));
  };

  const getFilteredLekarze = (): Lekarz[] => {
    if (selectedSpecjalizacja === 'all') {
      return lekarze;
    }
    return lekarze.filter(l => l.specjalizacja === selectedSpecjalizacja);
  };

  // Fetch available slots whenever lekarz + date range are selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedLekarz || !selectedDate) {
        setAvailableSlots([]);
        return;
      }
      try {
        setLoadingSlots(true);
        setError(null);
        // For now, use same day range (from=selectedDate, to=selectedDate)
        const resp: DostepneTerminyResponse = await apiService.getDostepneTerminy(
          selectedLekarz,
          // Placówka nie jest jeszcze wybierana w UI; użyj 1 lub lekarz.placowkaId jeśli dostępne
          1,
          selectedDate,
          selectedDate,
        );
        setAvailableSlots(resp.available.map(dt => dt.replace('Z', '')));
      } catch (err) {
        console.error('Error loading slots:', err);
        setError(t('bookVisit.errorLoadingSlots'));
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedLekarz, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLekarz || !selectedDate || !selectedTime) {
      setError(t('bookVisit.fillAllFields'));
      return;
    }

    // Combine date and time into ISO format
    const dateTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();

    try {
      setSubmitting(true);
      setError(null);

      // Use WizytaCreateRequest matching backend WizytaCreateDto
      const wizytaData: WizytaCreateRequest = {
        dataWizyty: dateTime,
        lekarzId: selectedLekarz,
        // placowkaId is optional, can be added later when placowki selection is implemented
        diagnoza: undefined,
      };

      await apiService.createWizyta(wizytaData);
      
      setSuccess(true);
      
      // Redirect to visits page after 2 seconds
      setTimeout(() => {
        navigate('/moje-wizyty');
      }, 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err instanceof Error ? err.message : t('bookVisit.errorBooking'));
    } finally {
      setSubmitting(false);
    }
  };

  // Format slots for display (HH:mm)
  const formattedSlots = availableSlots
    .filter(dt => dt.startsWith(selectedDate))
    .map(dt => dt.split('T')[1]?.substring(0,5))
    .filter(Boolean) as string[];
  const filteredLekarze = getFilteredLekarze();
  const specjalizacje = getUniqueSpecjalizacje();

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bookVisit.successTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('bookVisit.successMessage')}</p>
          <p className="text-sm text-gray-500">{t('bookVisit.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-alimed-blue hover:underline mb-4 flex items-center gap-2"
          >
            <span>←</span> {t('bookVisit.backToDashboard')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('bookVisit.title')}</h1>
          <p className="text-gray-600 mt-2">{t('bookVisit.subtitle')}</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Specialization filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('bookVisit.specialization')}
            </label>
            <select
              value={selectedSpecjalizacja}
              onChange={(e) => {
                setSelectedSpecjalizacja(e.target.value);
                setSelectedLekarz(null); // Reset doctor selection when filter changes
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
            >
              <option value="all">{t('bookVisit.allSpecializations')}</option>
              {specjalizacje.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-5 h-5 inline mr-1" />
              {t('bookVisit.selectDoctor')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLekarze.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {t('bookVisit.noDoctorsAvailable')}
                </div>
              ) : (
                filteredLekarze.map((lekarz) => (
                  <button
                    key={lekarz.lekarzId}
                    type="button"
                    onClick={() => setSelectedLekarz(lekarz.lekarzId)}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      selectedLekarz === lekarz.lekarzId
                        ? 'border-alimed-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {lekarz.imie} {lekarz.nazwisko}
                    </div>
                    <div className="text-sm text-gray-600">{lekarz.specjalizacja}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Date selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-5 h-5 inline mr-1" />
              {t('bookVisit.selectDate')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
            />
          </div>

          {/* Time selection - from available slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="w-5 h-5 inline mr-1" />
              {t('bookVisit.selectTime')}
            </label>
            {loadingSlots ? (
              <div className="text-gray-600">{t('common.loading')}</div>
            ) : (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent"
                disabled={!selectedLekarz || !selectedDate || formattedSlots.length === 0}
              >
                <option value="">{t('bookVisit.chooseTime')}</option>
                {formattedSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            )}
            {selectedLekarz && selectedDate && !loadingSlots && formattedSlots.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">{t('bookVisit.noSlotsForDay')}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !selectedLekarz || !selectedDate || !selectedTime}
              className="w-full px-6 py-3 bg-alimed-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? t('bookVisit.booking') : t('bookVisit.confirmBooking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UmowWizytePage;
