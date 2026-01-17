import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { enableDemoMode, enableDemoModeAsDoctor } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    enableDemoMode();
    navigate('/dashboard');
  };

  const handleDemoDoctorClick = () => {
    enableDemoModeAsDoctor();
    navigate('/panel-lekarza');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="AliMed" className="h-20" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-alimed-blue transition">
                {t('nav.home')}
              </Link>
              <Link to="/pacjenci" className="text-gray-700 hover:text-alimed-blue transition">
                {t('nav.functionality')}
              </Link>
              <LanguageSwitcher />
              <Link 
                to="/login" 
                className="bg-alimed-blue text-white px-4 py-2 rounded-lg hover:bg-alimed-light-blue transition"
              >
                {t('nav.login')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('landing.heroTitle')}
              <span className="text-alimed-blue block">{t('landing.heroTitleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('landing.heroDescription')}
            </p>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="bg-[#ACD045] text-white px-6 py-3 rounded-lg hover:bg-[#9bc03d] transition font-medium"
              >
                {t('landing.register')}
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                {t('nav.login')}
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img 
              src="/doctor-homepage.png" 
              alt="Lekarz z pacjentem" 
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Patients */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-alimed-blue">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-alimed-light-blue/20 rounded-full flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-alimed-blue" />
              </div>
              <h3 className="text-lg font-semibold text-alimed-blue">{t('landing.forPatient')}</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.visitRegistration')}</p>
                  <p className="text-sm text-gray-500">{t('landing.visitRegistrationDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.medicalHistory')}</p>
                  <p className="text-sm text-gray-500">{t('landing.medicalHistoryDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.dataManagement')}</p>
                  <p className="text-sm text-gray-500">{t('landing.dataManagementDesc')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* For Staff */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-amber-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-amber-600">{t('landing.forStaff')}</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.patientList')}</p>
                  <p className="text-sm text-gray-500">{t('landing.patientListDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.visitSchedule')}</p>
                  <p className="text-sm text-gray-500">{t('landing.visitScheduleDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('landing.confirmations')}</p>
                  <p className="text-sm text-gray-500">{t('landing.confirmationsDesc')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-alimed-blue via-alimed-light-blue to-[#ACD045] rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse-soft"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse-soft"></div>
          
          <div className="relative z-10 text-center text-white">
            <PlayCircleIcon className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('landing.tryDemo')}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('landing.demoDescription')}
            </p>
            <button
              onClick={handleDemoClick}
              className="group inline-flex items-center gap-3 bg-white text-alimed-blue px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <PlayCircleIcon className="w-6 h-6 group-hover:animate-pulse" />
              <span>{t('landing.tryDemo')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={handleDemoDoctorClick}
              className="group inline-flex items-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ml-4"
            >
              <CalendarIcon className="w-6 h-6 group-hover:animate-pulse" />
              <span>{t('doctorDashboard.tryDemoDoctor')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-4 text-sm text-white/75">
              {t('landing.demoMode')} • Brak rejestracji • Bez logowania
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-alimed-blue text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; 2025 AliMed - {t('common.teamWSB')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
