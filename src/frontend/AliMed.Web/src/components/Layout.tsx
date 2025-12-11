import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="AliMed" className="h-20" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className={`transition ${isActive('/') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/pacjenci" 
                className={`transition ${isActive('/pacjenci') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.patients')}
              </Link>
              <Link 
                to="/lekarze" 
                className={`transition ${isActive('/lekarze') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.doctors')}
              </Link>
              <Link 
                to="/moje-wizyty" 
                className={`transition ${isActive('/moje-wizyty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.myVisits')}
              </Link>
              <Link 
                to="/wizyty" 
                className={`transition ${isActive('/wizyty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.visits')}
              </Link>
              <Link 
                to="/dokumenty" 
                className={`transition ${isActive('/dokumenty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                {t('nav.documents')}
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-alimed-blue text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p>&copy; 2025 AliMed - {t('common.teamWSB')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
