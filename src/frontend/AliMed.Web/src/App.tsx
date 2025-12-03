import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PacjenciPage from './pages/PacjenciPage';
import Layout from './components/Layout';

function App() {
  return (
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
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-alimed-blue mb-4">Lekarze</h2>
              <p className="text-gray-600">Strona w budowie - czekamy na endpoint API</p>
            </div>
          </Layout>
        } />
        <Route path="/wizyty" element={
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-alimed-blue mb-4">Wizyty</h2>
              <p className="text-gray-600">Strona w budowie - czekamy na endpoint API</p>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

