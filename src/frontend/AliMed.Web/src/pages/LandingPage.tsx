import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="AliMed" className="h-12 w-auto" />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-alimed-blue transition">
                Strona główna
              </Link>
              <Link to="/pacjenci" className="text-gray-700 hover:text-alimed-blue transition">
                Funkcjonalność
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              AliMed – Internetowa
              <span className="text-alimed-blue block">Rejestracja Pacjentów</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Zarządzaj wizytami i dokumentacją medyczną. Prosty i bezpieczny system dla pacjentów i personelu medycznego.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="bg-[#ACD045] text-white px-6 py-3 rounded-lg hover:bg-[#9bc03d] transition font-medium"
              >
                Zarejestruj się
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Zaloguj się
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
              <h3 className="text-lg font-semibold text-alimed-blue">Dla pacjenta</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Rejestracja wizyt</p>
                  <p className="text-sm text-gray-500">Umów wizytę online w dowolnym czasie</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Historia medyczna</p>
                  <p className="text-sm text-gray-500">Przeglądaj swoją dokumentację medyczną</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Zarządzanie danymi</p>
                  <p className="text-sm text-gray-500">Aktualizuj swoje dane osobowe</p>
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
              <h3 className="text-lg font-semibold text-amber-600">Dla personelu</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Lista pacjentów</p>
                  <p className="text-sm text-gray-500">Przeglądaj i zarządzaj bazą pacjentów</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Terminy wizyt</p>
                  <p className="text-sm text-gray-500">Aktualizuj i zarządzaj terminarzem</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Potwierdzenia</p>
                  <p className="text-sm text-gray-500">Potwierdzaj rezerwacje pacjentów</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-alimed-blue text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; 2025 AliMed - Zespół nr 3 WSB. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
