import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PacjenciPage from './pages/PacjenciPage';
import Layout from './components/Layout';

// Placeholder components for doctors and visits pages
function DoctorsPageContent() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-alimed-blue mb-4">{t('doctors.title')}</h2>
      <p className="text-gray-600">{t('doctors.underConstruction')}</p>
    </div>
  );
}

function VisitsPageContent() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-alimed-blue mb-4">{t('visits.title')}</h2>
      <p className="text-gray-600">{t('visits.underConstruction')}</p>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Admin/Staff routes */}
          <Route path="/pacjenci" element={
            <Layout>
              <PacjenciPage />
            </Layout>
          } />
          <Route path="/lekarze" element={
            <Layout>
              <DoctorsPageContent />
            </Layout>
          } />
          <Route path="/wizyty" element={
            <Layout>
              <VisitsPageContent />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

