import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('alimed_token');
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user display name
  const getUserName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.username) return user.username;
    
    // Try to get from localStorage
    const userData = localStorage.getItem('alimed_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.firstName || parsed.username || 'User';
      } catch {
        return 'User';
      }
    }
    
    // Try to decode from JWT
    const token = localStorage.getItem('alimed_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.unique_name || payload.github_login || payload.email?.split('@')[0] || 'User';
      } catch {
        return 'User';
      }
    }
    
    return 'User';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - goes to dashboard if logged in, otherwise to landing */}
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center">
              <img src="/logo.svg" alt="AliMed" className="h-20" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  {/* Logged in navigation */}
                  <Link 
                    to="/dashboard" 
                    className={`transition ${isActive('/dashboard') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    to="/moje-wizyty" 
                    className={`transition ${isActive('/moje-wizyty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('nav.myVisits')}
                  </Link>
                  <Link 
                    to="/umow-wizyte" 
                    className={`transition ${isActive('/umow-wizyte') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('dashboard.bookVisit')}
                  </Link>
                  <Link 
                    to="/dokumenty" 
                    className={`transition ${isActive('/dokumenty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('nav.documents')}
                  </Link>
                  <Link 
                    to="/moje-dane" 
                    className={`transition ${isActive('/moje-dane') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('dashboard.myData')}
                  </Link>
                  <LanguageSwitcher />
                  <span className="text-gray-600 text-sm">
                    {t('dashboard.welcome')}, {getUserName()}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  {/* Not logged in navigation */}
                  <Link 
                    to="/" 
                    className={`transition ${isActive('/') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
                  >
                    {t('nav.home')}
                  </Link>
                  <LanguageSwitcher />
                  <Link 
                    to="/login" 
                    className="bg-alimed-blue text-white px-4 py-2 rounded-lg hover:bg-alimed-light-blue transition"
                  >
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-alimed-blue text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p>&copy; {new Date().getFullYear()} AliMed - {t('common.teamWSB')}. {t('common.allRightsReserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
