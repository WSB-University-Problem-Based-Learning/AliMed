import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { User, Pacjent, UpdatePacjentProfileRequest } from '../types/api';

const MojeDanePage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser, isDemoMode } = useAuth();
  const navigate = useNavigate();
  
  const [user] = useState<User | null>(() => {
    if (authUser) return authUser;
    const userData = localStorage.getItem('alimed_user');
    if (userData) return JSON.parse(userData);
    
    // Fallback: decode JWT to get user info
    const token = localStorage.getItem('alimed_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.nameid || 'unknown',
          email: payload.email || '',
          firstName: payload.unique_name || payload.github_login || 'User',
          lastName: '',
          role: 0,
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const [pacjent, setPacjent] = useState<Pacjent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    imie: '',
    nazwisko: '',
    email: '',
    telefon: '',
    ulica: '',
    numerDomu: '',
    kodPocztowy: '',
    miasto: '',
    pesel: '',
    dataUrodzenia: '',
    kraj: 'Polska',
  });

  useEffect(() => {
    const fetchPacjentData = async () => {
      // Check for token first, not user object
      const token = localStorage.getItem('alimed_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // In demo mode, use mock data
        if (isDemoMode) {
          const mockPacjent: Pacjent = {
            pacjentId: 1,
            imie: user?.firstName || 'Jan',
            nazwisko: user?.lastName || 'Kowalski',
            pesel: '90010112345',
            dataUrodzenia: '1990-01-01',
            adresZamieszkania: {
              ulica: 'Przykładowa',
              numerDomu: '10',
              kodPocztowy: '00-001',
              miasto: 'Warszawa',
            },
          };
          setPacjent(mockPacjent);
          setFormData({
            imie: mockPacjent.imie || '',
            nazwisko: mockPacjent.nazwisko || '',
            email: user?.email || '',
            telefon: '',
            ulica: mockPacjent.adresZamieszkania?.ulica || '',
            numerDomu: mockPacjent.adresZamieszkania?.numerDomu || '',
            kodPocztowy: mockPacjent.adresZamieszkania?.kodPocztowy || '',
            miasto: mockPacjent.adresZamieszkania?.miasto || '',
            pesel: mockPacjent.pesel || '',
            dataUrodzenia: mockPacjent.dataUrodzenia || '',
            kraj: mockPacjent.adresZamieszkania?.kraj || 'Polska',
          });
        } else {
          const pacjentData = await apiService.getMojProfil();
          setPacjent(pacjentData);
          setFormData({
            imie: pacjentData.imie || user?.firstName || '',
            nazwisko: pacjentData.nazwisko || user?.lastName || '',
            email: pacjentData.email || user?.email || '',
            telefon: '',
            ulica: pacjentData.adresZamieszkania?.ulica || '',
            numerDomu: pacjentData.adresZamieszkania?.numerDomu || '',
            kodPocztowy: pacjentData.adresZamieszkania?.kodPocztowy || '',
            miasto: pacjentData.adresZamieszkania?.miasto || '',
            pesel: pacjentData.pesel || '',
            dataUrodzenia: pacjentData.dataUrodzenia || '',
            kraj: pacjentData.adresZamieszkania?.kraj || 'Polska',
          });
        }
      } catch (err) {
        setError(t('myData.errorLoading'));
        console.error('Error loading patient data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacjentData();
  }, [user, navigate, isDemoMode, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemoMode) {
      // In demo mode, just show success message
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    try {
      const payload: UpdatePacjentProfileRequest = {
        imie: formData.imie,
        nazwisko: formData.nazwisko,
        pesel: formData.pesel || pacjent?.pesel || '',
        dataUrodzenia: formData.dataUrodzenia || pacjent?.dataUrodzenia || '',
        ulica: formData.ulica,
        numerDomu: formData.numerDomu,
        kodPocztowy: formData.kodPocztowy,
        miasto: formData.miasto,
        kraj: formData.kraj || 'Polska',
      };

      await apiService.updateMojProfil(payload);

      // Refresh data after save
      const refreshed = await apiService.getMojProfil();
      setPacjent(refreshed);
      setFormData({
        imie: refreshed.imie || '',
        nazwisko: refreshed.nazwisko || '',
        email: refreshed.email || formData.email,
        telefon: formData.telefon,
        ulica: refreshed.adresZamieszkania?.ulica || '',
        numerDomu: refreshed.adresZamieszkania?.numerDomu || '',
        kodPocztowy: refreshed.adresZamieszkania?.kodPocztowy || '',
        miasto: refreshed.adresZamieszkania?.miasto || '',
        pesel: refreshed.pesel || '',
        dataUrodzenia: refreshed.dataUrodzenia || '',
        kraj: refreshed.adresZamieszkania?.kraj || 'Polska',
      });

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(t('myData.errorSaving'));
      console.error('Error saving patient data:', err);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (pacjent) {
      setFormData({
        imie: pacjent.imie || '',
        nazwisko: pacjent.nazwisko || '',
        email: user?.email || '',
        telefon: '',
        ulica: pacjent.adresZamieszkania?.ulica || '',
        numerDomu: pacjent.adresZamieszkania?.numerDomu || '',
        kodPocztowy: pacjent.adresZamieszkania?.kodPocztowy || '',
        miasto: pacjent.adresZamieszkania?.miasto || '',
        pesel: pacjent.pesel || '',
        dataUrodzenia: pacjent.dataUrodzenia || '',
        kraj: pacjent.adresZamieszkania?.kraj || 'Polska',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-alimed-blue text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-alimed-blue hover:underline mb-4 inline-flex items-center"
        >
          ← {t('bookVisit.backToDashboard')}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t('myData.title')}</h1>
        <p className="text-gray-600 mt-2">{t('myData.subtitle')}</p>
      </div>

      {/* Demo mode notice */}
      {isDemoMode && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-800">
                {t('dashboard.demoNotice')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm font-medium text-green-800">
              {t('myData.saveSuccess')}
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2 text-alimed-blue" />
                {t('myData.personalInfo')}
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.firstName')}
                </label>
                <input
                  type="text"
                  name="imie"
                  value={formData.imie}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.lastName')}
                </label>
                <input
                  type="text"
                  name="nazwisko"
                  value={formData.nazwisko}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {pacjent?.pesel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('myData.pesel')}
                  </label>
                  <input
                    type="text"
                    value={pacjent.pesel}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              )}

              {pacjent?.dataUrodzenia && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('myData.birthDate')}
                  </label>
                  <input
                    type="text"
                    value={new Date(pacjent.dataUrodzenia).toLocaleDateString('pl-PL')}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <EnvelopeIcon className="w-6 h-6 mr-2 text-alimed-blue" />
              {t('myData.contactInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.phone')}
                </label>
                <input
                  type="tel"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+48 123 456 789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2 text-alimed-blue" />
              {t('myData.address')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.street')}
                </label>
                <input
                  type="text"
                  name="ulica"
                  value={formData.ulica}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.houseNumber')}
                </label>
                <input
                  type="text"
                  name="numerDomu"
                  value={formData.numerDomu}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.postalCode')}
                </label>
                <input
                  type="text"
                  name="kodPocztowy"
                  value={formData.kodPocztowy}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="00-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('myData.city')}
                </label>
                <input
                  type="text"
                  name="miasto"
                  value={formData.miasto}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alimed-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t('common.save')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MojeDanePage;
