import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlusIcon, CalendarDaysIcon, ClipboardDocumentListIcon, UserGroupIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = {
    patient: [
      { icon: <UserPlusIcon className="w-6 h-6" />, text: t('landing.visitRegistration') },
      { icon: <CalendarDaysIcon className="w-6 h-6" />, text: t('landing.visitRegistrationDesc') },
      { icon: <ClipboardDocumentListIcon className="w-6 h-6" />, text: t('landing.medicalHistory') },
      { icon: <UserGroupIcon className="w-6 h-6" />, text: t('landing.dataManagement') },
    ],
    staff: [
      { icon: <UserGroupIcon className="w-6 h-6" />, text: t('landing.patientList') },
      { icon: <CheckBadgeIcon className="w-6 h-6" />, text: t('landing.confirmations') },
      { icon: <ClockIcon className="w-6 h-6" />, text: t('landing.visitSchedule') },
      { icon: <ClipboardDocumentListIcon className="w-6 h-6" />, text: t('landing.patientListDesc') },
    ]
  };

  const teamMembers = [
    'Grzegorz Matusewicz',
    'Julia Łopata',
    'Szymon Małota',
    'Damian Litewka',
    'Łukasz Antoniewicz',
    'Aleksander Kutycki'
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="AliMed" className="h-16 group-hover:scale-105 transition-transform duration-300" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="font-medium"
              >
                {t('nav.login')}
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                className="hidden sm:inline-flex shadow-lg shadow-blue-500/30"
              >
                {t('landing.register')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Hero Section */}
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/50 rounded-3xl shadow-sm border border-blue-50">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {t('landing.heroTitle')} <span className="text-alimed-blue">{t('landing.heroTitleHighlight')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-8">
            {t('landing.heroDescription')}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="shadow-lg shadow-blue-500/30"
            >
              {t('landing.register')}
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border border-blue-100 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg text-alimed-blue">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('landing.forPatient')}</h2>
            </div>
            <ul className="space-y-4">
              {features.patient.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 text-alimed-blue shrink-0">{feature.icon}</div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border border-emerald-100 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <ClipboardDocumentListIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('landing.forStaff')}</h2>
            </div>
            <ul className="space-y-4">
              {features.staff.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 text-emerald-600 shrink-0">{feature.icon}</div>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Tech & Team Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 bg-slate-50 border border-slate-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technologia</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Oracle Cloud Infrastructure
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                MySQL 9.5.2
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Ubuntu 24.04 LTS
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                React + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                .NET 9 WebAPI
              </li>
            </ul>
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-alimed-blue to-blue-600 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6">{t('common.teamWSB')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2 text-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium">{member}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-alimed-blue text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="opacity-90 hover:opacity-100 transition-opacity">&copy; {new Date().getFullYear()} AliMed - {t('common.teamWSB')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
