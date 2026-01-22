import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import DashboardPage from './pages/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import WizytyLekarzPage from './pages/WizytyLekarzPage';
import PacjenciLekarzPage from './pages/PacjenciLekarzPage';
import DokumentacjaLekarzPage from './pages/DokumentacjaLekarzPage';
import MojeDaneLekarzPage from './pages/MojeDaneLekarzPage';
import DoctorPatientDetailsPage from './pages/DoctorPatientDetailsPage';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/panel-lekarza" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <DoctorDashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/wizyty-lekarza" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <WizytyLekarzPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pacjenci-lekarza" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <PacjenciLekarzPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pacjenci-lekarza/:id" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <DoctorPatientDetailsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dokumentacja-lekarza" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <DokumentacjaLekarzPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/moje-dane-lekarza" element={
              <ProtectedRoute roles={[1]}>
                <Layout>
                  <MojeDaneLekarzPage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin/Staff routes */}
            <Route path="/pacjenci" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <PacjenciPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={[2]}>
                <Layout>
                  <AdminDashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/moje-wizyty" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <MojeWizytyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/umow-wizyte" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <UmowWizytePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dokumenty" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <DokumentyPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/moje-dane" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <MojeDanePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/lekarze" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <LekarzePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/placowki" element={
              <ProtectedRoute roles={[0, 2]}>
                <Layout>
                  <PlacowkiPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/wizyty" element={
              <ProtectedRoute roles={[0]}>
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

