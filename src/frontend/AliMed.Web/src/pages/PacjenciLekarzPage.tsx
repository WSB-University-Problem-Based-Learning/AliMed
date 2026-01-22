import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import type { Pacjent } from '../types/api';

const PacjenciLekarzPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [pacjenci, setPacjenci] = useState<Pacjent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isDemoMode) {
          // Mock data for demo mode
          const mockData: Pacjent[] = [
            { pacjentId: 1, imie: 'Maria', nazwisko: 'Nowak', pesel: '85031234567', dataUrodzenia: '1985-03-12', email: 'maria.nowak@example.com' },
            { pacjentId: 2, imie: 'Jan', nazwisko: 'Kowalski', pesel: '78012345678', dataUrodzenia: '1978-01-23', email: 'jan.kowalski@example.com' },
          ];
          setPacjenci(mockData);
        } else {
          try {
            const patientsData = await apiService.getLekarzPacjenci();
            setPacjenci(patientsData);
          } catch (err) {
            console.error('Error details:', err);
            throw err;
          }
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
        setError(t('error.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDemoMode, t]);

  const handleViewPatient = (id: number) => {
    navigate(`/pacjenci-lekarza/${id}`);
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {t('dashboard.demoNotice')}
          </div>
        )}

        {/* Pacjenci section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('doctorPatients.title')}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                {t('common.loading')}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                {error}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorPatients.patient')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('login.email')}
                      {/* Using static string for 'Email' or adding key, but for now Email is universal or I can look for a key */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('doctorPatients.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pacjenci.map((pacjent) => (
                    <tr
                      key={pacjent.pacjentId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {pacjent.imie} {pacjent.nazwisko}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('doctorPatients.peselLabel')}: {pacjent.pesel}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pacjent.email || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleViewPatient(pacjent.pacjentId)}
                            className="text-alimed-blue hover:text-blue-700 text-sm font-medium hover:underline"
                          >
                            {t('doctorPatients.view')}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && !error && pacjenci.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              {t('doctorPatients.noPatients')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PacjenciLekarzPage;
