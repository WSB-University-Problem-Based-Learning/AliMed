import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="AliMed" className="h-10 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className={`transition ${isActive('/') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                Strona główna
              </Link>
              <Link 
                to="/pacjenci" 
                className={`transition ${isActive('/pacjenci') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                Pacjenci
              </Link>
              <Link 
                to="/lekarze" 
                className={`transition ${isActive('/lekarze') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                Lekarze
              </Link>
              <Link 
                to="/wizyty" 
                className={`transition ${isActive('/wizyty') ? 'text-alimed-blue font-medium' : 'text-gray-700 hover:text-alimed-blue'}`}
              >
                Wizyty
              </Link>
              <Link 
                to="/login" 
                className="bg-alimed-blue text-white px-4 py-2 rounded-lg hover:bg-alimed-light-blue transition"
              >
                Zaloguj się
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
          <p>&copy; 2025 AliMed - Zespół nr 3 WSB. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
