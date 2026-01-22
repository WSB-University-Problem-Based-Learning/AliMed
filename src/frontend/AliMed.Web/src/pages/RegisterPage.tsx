import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { RegisterRequest } from '../types/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    pesel: '',
    dataUrodzenia: '',
    ulica: '',
    numerDomu: '',
    kodPocztowy: '',
    miasto: '',
    kraj: 'Polska',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateStep1 = (): boolean => {
    if (!formData.email || !formData.username || !formData.password) {
      setError(t('register.fillRequiredFields'));
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError(t('register.passwordsDoNotMatch'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('register.passwordTooShort'));
      return false;
    }
    return true;
  };

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  const getInputClass = (name: string) => (
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alimed-light-blue focus:border-transparent transition ${getFieldError(name) ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`
  );

  const applyApiErrors = (message: string): boolean => {
    try {
      const parsed = JSON.parse(message);
      if (!parsed || typeof parsed !== 'object' || !parsed.errors) {
        return false;
      }
      const fieldMap: Record<string, string> = {
        Email: 'email',
        Username: 'username',
        Password: 'password',
        FirstName: 'firstName',
        LastName: 'lastName',
        Pesel: 'pesel',
        DataUrodzenia: 'dataUrodzenia',
        Ulica: 'ulica',
        NumerDomu: 'numerDomu',
        KodPocztowy: 'kodPocztowy',
        Miasto: 'miasto',
        Kraj: 'kraj',
      };
      const nextErrors: Record<string, string[]> = {};
      Object.entries(parsed.errors as Record<string, string[] | string>).forEach(([key, value]) => {
        const fieldName = fieldMap[key] || key;
        const messages = Array.isArray(value) ? value : [String(value)];
        nextErrors[fieldName] = messages;
      });
      if (Object.keys(nextErrors).length === 0) {
        return false;
      }
      setFieldErrors(nextErrors);
      setError(t('register.validationFailed'));
      return true;
    } catch {
      return false;
    }
  };

  const handleNextStep = () => {
    setError('');
    setFieldErrors({});
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setFieldErrors({});
    setStep(1);
  };

  const validateStep2 = (): boolean => {
    const requiredFields: (keyof RegisterRequest)[] = [
      'firstName', 'lastName', 'pesel', 'ulica', 'numerDomu', 'kodPocztowy', 'miasto'
    ];
    let isValid = true;
    const newErrors: Record<string, string[]> = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = [t('common.required')];
        isValid = false;
      }
    });

    if (!isValid) {
      setFieldErrors(newErrors);
      setError(t('register.fillRequiredFields'));
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateStep2()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data with proper date format
      const payload: RegisterRequest = {
        ...formData,
        // Convert date to ISO format if provided
        dataUrodzenia: formData.dataUrodzenia ?
          new Date(formData.dataUrodzenia).toISOString() :
          undefined,
      };

      const response = await apiService.register(payload);
      login(response.token, response.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error && applyApiErrors(err.message)) {
        return;
      }
      setError(err instanceof Error ? err.message : t('register.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        {/* Language Switcher */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-alimed-blue hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('common.backToHome')}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="AliMed" className="h-20 w-auto" />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          {t('register.title')}
        </h2>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-alimed-blue' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-alimed-blue' : 'bg-gray-300'}`} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">{t('register.step1Title')}</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('register.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass('email')}
                  required
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('register.username')} *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={getInputClass('username')}
                  required
                />
                {getFieldError('username') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('username')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('register.password')} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${getInputClass('password')} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('register.confirmPassword')} *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-alimed-light-blue focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-alimed-light-blue hover:bg-alimed-blue text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {t('register.next')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">{t('register.step2Title')}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.firstName')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={getInputClass('firstName')}
                  />
                  {getFieldError('firstName') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('firstName')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={getInputClass('lastName')}
                  />
                  {getFieldError('lastName') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('lastName')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.pesel')}
                  </label>
                  <input
                    type="text"
                    name="pesel"
                    value={formData.pesel}
                    onChange={handleChange}
                    maxLength={11}
                    className={getInputClass('pesel')}
                  />
                  {getFieldError('pesel') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('pesel')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('register.birthDate')}
                  </label>
                  <input
                    type="date"
                    name="dataUrodzenia"
                    value={formData.dataUrodzenia}
                    onChange={handleChange}
                    className={getInputClass('dataUrodzenia')}
                  />
                  {getFieldError('dataUrodzenia') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('dataUrodzenia')}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">{t('register.addressSection')}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('register.street')}
                    </label>
                    <input
                      type="text"
                      name="ulica"
                      value={formData.ulica}
                      onChange={handleChange}
                      className={getInputClass('ulica')}
                    />
                    {getFieldError('ulica') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('ulica')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('register.houseNumber')}
                    </label>
                    <input
                      type="text"
                      name="numerDomu"
                      value={formData.numerDomu}
                      onChange={handleChange}
                      className={getInputClass('numerDomu')}
                    />
                    {getFieldError('numerDomu') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('numerDomu')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('register.postalCode')}
                    </label>
                    <input
                      type="text"
                      name="kodPocztowy"
                      value={formData.kodPocztowy}
                      onChange={handleChange}
                      placeholder="00-000"
                      className={getInputClass('kodPocztowy')}
                    />
                    {getFieldError('kodPocztowy') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('kodPocztowy')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('register.city')}
                    </label>
                    <input
                      type="text"
                      name="miasto"
                      value={formData.miasto}
                      onChange={handleChange}
                      className={getInputClass('miasto')}
                    />
                    {getFieldError('miasto') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('miasto')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {t('register.back')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-alimed-light-blue hover:bg-alimed-blue text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('register.submit')}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-alimed-blue hover:underline text-sm">
            {t('register.alreadyHaveAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
