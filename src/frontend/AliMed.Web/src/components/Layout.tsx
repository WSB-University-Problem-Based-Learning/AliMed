import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  HomeIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

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

  // Navigation items with their colors matching dashboard
  const navItems = [
    {
      path: '/dashboard',
      label: t('nav.home'),
      icon: HomeIcon,
      activeColor: 'bg-alimed-blue text-white',
      hoverColor: 'hover:bg-blue-50 hover:text-alimed-blue'
    },
    {
      path: '/moje-wizyty',
      label: t('nav.myVisits'),
      icon: CalendarDaysIcon,
      activeColor: 'bg-emerald-500 text-white',
      hoverColor: 'hover:bg-emerald-50 hover:text-emerald-600'
    },
    {
      path: '/umow-wizyte',
      label: t('dashboard.bookVisit'),
      icon: PlusCircleIcon,
      activeColor: 'bg-purple-500 text-white',
      hoverColor: 'hover:bg-purple-50 hover:text-purple-600'
    },
    {
      path: '/dokumenty',
      label: t('nav.documents'),
      icon: DocumentTextIcon,
      activeColor: 'bg-amber-500 text-white',
      hoverColor: 'hover:bg-amber-50 hover:text-amber-600'
    },
    {
      path: '/moje-dane',
      label: t('dashboard.myData'),
      icon: UserCircleIcon,
      activeColor: 'bg-rose-500 text-white',
      hoverColor: 'hover:bg-rose-50 hover:text-rose-600'
    },
  ];

  if (user?.role === 2) {
    navItems.push({
      path: '/admin',
      label: 'Admin',
      icon: ShieldExclamationIcon,
      activeColor: 'bg-slate-700 text-white',
      hoverColor: 'hover:bg-slate-100 hover:text-slate-700'
    });
  }

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
            <nav className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* Logged in navigation with color-coded items */}
                  {/* Logged in navigation with color-coded items */}
                  {user?.role === 1 ? (
                    // Doctor Navigation
                    <>
                      <Link
                        to="/panel-lekarza"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/panel-lekarza') ? 'bg-alimed-blue text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-alimed-blue'
                          }`}
                      >
                        <HomeIcon className="w-4 h-4" />
                        <span className="hidden lg:inline">{t('nav.home')}</span>
                      </Link>
                      <Link
                        to="/wizyty-lekarza"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/wizyty-lekarza') ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                      >
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span className="hidden lg:inline">{t('doctorDashboard.visits')}</span>
                      </Link>
                      <Link
                        to="/pacjenci-lekarza"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/pacjenci-lekarza') ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span className="hidden lg:inline">{t('doctorDashboard.patients')}</span>
                      </Link>
                      <Link
                        to="/dokumentacja-lekarza"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dokumentacja-lekarza') ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                        <span className="hidden lg:inline">{t('doctorDashboard.documentation')}</span>
                      </Link>
                      <Link
                        to="/moje-dane-lekarza"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/moje-dane-lekarza') ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span className="hidden lg:inline">{t('doctorDashboard.myData')}</span>
                      </Link>
                    </>
                  ) : (
                    // Patient/Admin Navigation (Admin appends to this)
                    navItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                              ? item.activeColor + ' shadow-sm'
                              : 'text-gray-600 ' + item.hoverColor
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden lg:inline">{item.label}</span>
                        </Link>
                      );
                    })
                  )}
                  <div className="h-6 w-px bg-gray-300 mx-1" />
                  <LanguageSwitcher />
                  <span className="text-gray-600 text-sm hidden md:inline">
                    {getUserName()}
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
