import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import DashboardPage from './pages/DashboardPage';
import PacjenciPage from './pages/PacjenciPage';
import MojeWizytyPage from './pages/MojeWizytyPage';
import UmowWizytePage from './pages/UmowWizytePage';
import DokumentyPage from './pages/DokumentyPage';
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
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Admin/Staff routes */}
            <Route path="/pacjenci" element={
              <ProtectedRoute>
                <Layout>
                  <PacjenciPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/moje-wizyty" element={
              <ProtectedRoute>
                <Layout>
                  <MojeWizytyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/umow-wizyte" element={
              <ProtectedRoute>
                <Layout>
                  <UmowWizytePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dokumenty" element={
              <ProtectedRoute>
                <Layout>
                  <DokumentyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/lekarze" element={
              <ProtectedRoute>
                <Layout>
                  <DoctorsPageContent />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/wizyty" element={
              <ProtectedRoute>
                <Layout>
                  <VisitsPageContent />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

