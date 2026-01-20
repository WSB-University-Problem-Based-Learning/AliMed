import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

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
              <a href="#features" className="text-gray-700 hover:text-alimed-blue transition">
                {t('nav.functionality')}
              </a>
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
                to="/register" 
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
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      {/* Footer */}
      <footer className="bg-alimed-blue text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; {new Date().getFullYear()} AliMed - {t('common.teamWSB')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

