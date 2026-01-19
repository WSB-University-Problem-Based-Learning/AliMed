import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import DashboardPage from './pages/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import WizytyLekarzPage from './pages/WizytyLekarzPage';
import PacjenciLekarzPage from './pages/PacjenciLekarzPage';
import DokumentacjaLekarzPage from './pages/DokumentacjaLekarzPage';
import MojeDaneLekarzPage from './pages/MojeDaneLekarzPage';
import PacjenciPage from './pages/PacjenciPage';
import MojeWizytyPage from './pages/MojeWizytyPage';
import UmowWizytePage from './pages/UmowWizytePage';
import DokumentyPage from './pages/DokumentyPage';
import MojeDanePage from './pages/MojeDanePage';
import Layout from './components/Layout';
import LekarzePage from './pages/LekarzePage';
import PlacowkiPage from './pages/PlacowkiPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Placeholder component for visits page
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
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/panel-lekarza" element={
              <ProtectedRoute>
                <DoctorDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/wizyty-lekarza" element={
              <ProtectedRoute>
                <WizytyLekarzPage />
              </ProtectedRoute>
            } />
            <Route path="/pacjenci-lekarza" element={
              <ProtectedRoute>
                <PacjenciLekarzPage />
              </ProtectedRoute>
            } />
            <Route path="/dokumentacja-lekarza" element={
              <ProtectedRoute>
                <DokumentacjaLekarzPage />
              </ProtectedRoute>
            } />
            <Route path="/moje-dane-lekarza" element={
              <ProtectedRoute>
                <MojeDaneLekarzPage />
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
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboardPage />
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
            <Route path="/moje-dane" element={
              <ProtectedRoute>
                <Layout>
                  <MojeDanePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/lekarze" element={
              <ProtectedRoute>
                <Layout>
                  <LekarzePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/placowki" element={
              <ProtectedRoute>
                <Layout>
                  <PlacowkiPage />
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

