import React, { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';
import type { AdminUserSummary, AdminPacjentSummary, AdminLekarzSummary, Placowka, PromoteToDoctorRequest } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import Card from '../components/Card';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [pacjenci, setPacjenci] = useState<AdminPacjentSummary[]>([]);
  const [lekarze, setLekarze] = useState<AdminLekarzSummary[]>([]);
  const [placowki, setPlacowki] = useState<Placowka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [pacjentFilter, setPacjentFilter] = useState('');
  const [lekarzFilter, setLekarzFilter] = useState('');
  const [form, setForm] = useState<PromoteToDoctorRequest>({
    specjalizacja: '',
    placowkaId: 0,
  });

  const specjalizacje = [
    'Internista',
    'Pediatra',
    'Kardiolog',
    'Dermatolog',
    'Ortopeda',
    'Ginekolog',
    'Neurolog',
    'Endokrynolog',
    'Urolog',
    'Okulista',
    'Pulmonolog',
    'Reumatolog',
    'Hematolog',
    'Psychiatra',
    'Geriatra',
    'Onkolog',
    'Chirurg',
    'Anestezjolog',
  ];

  const isAdmin = user?.role === 2;

  const userOptions = useMemo(
    () => users.filter(u => u.role === 'User'),
    [users]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [usersData, placowkiData, pacjenciData, lekarzeData] = await Promise.all([
          apiService.getAdminUsers(),
          apiService.getPlacowki().catch(() => []),
          apiService.getAdminPacjenci(),
          apiService.getAdminLekarze(),
        ]);
        setUsers(usersData);
        setPlacowki(placowkiData);
        setPacjenci(pacjenciData);
        setLekarze(lekarzeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('adminDashboard.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'placowkaId' ? Number(value) : value,
    }));
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUserId) {
      setError(t('adminDashboard.selectUserError'));
      return;
    }

    if (!form.specjalizacja || !form.placowkaId) {
      setError(t('adminDashboard.fillAllFieldsError'));
      return;
    }

    try {
      await apiService.promoteUserToDoctor(selectedUserId, form);
      const [usersData, pacjenciData, lekarzeData] = await Promise.all([
        apiService.getAdminUsers(),
        apiService.getAdminPacjenci(),
        apiService.getAdminLekarze(),
      ]);
      setUsers(usersData);
      setPacjenci(pacjenciData);
      setLekarze(lekarzeData);
      setSelectedUserId('');
      setForm({ specjalizacja: '', placowkaId: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('adminDashboard.saveError'));
    }
  };

  const filteredPacjenci = pacjenci.filter(p => {
    const fullName = `${p.imie || ''} ${p.nazwisko || ''}`.toLowerCase();
    return fullName.includes(pacjentFilter.trim().toLowerCase());
  });

  const filteredLekarze = lekarze.filter(l => {
    const fullName = `${l.imie || ''} ${l.nazwisko || ''}`.toLowerCase();
    return fullName.includes(lekarzFilter.trim().toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-alimed-blue text-xl">{t('adminDashboard.loading')}</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center text-gray-600">
        {t('adminDashboard.accessDenied')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-alimed-blue">{t('adminDashboard.title')}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('adminDashboard.changeRoleToDoctor')}</h3>
        <form onSubmit={handlePromote} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('adminDashboard.selectUser')}</option>
            {userOptions.map(u => (
              <option key={u.userId} value={u.userId}>
                {u.username || u.email || u.userId}
              </option>
            ))}
          </select>

          <select
            name="placowkaId"
            value={form.placowkaId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('adminDashboard.selectFacility')}</option>
            {placowki.map(p => (
              <option key={p.placowkaId} value={p.placowkaId}>
                {p.nazwa || `Placowka ${p.placowkaId}`}
              </option>
            ))}
          </select>

          <select
            name="specjalizacja"
            value={form.specjalizacja}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('adminDashboard.specialization')}</option>
            {specjalizacje.map(spec => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full md:col-span-2 px-4 py-2 bg-alimed-blue text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('adminDashboard.promote')}
          </button>
        </form>
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{t('adminDashboard.patients')}</h3>
          <input
            value={pacjentFilter}
            onChange={(e) => setPacjentFilter(e.target.value)}
            placeholder={t('adminDashboard.filterPlaceholder')}
            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('doctorPatients.patient')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PESEL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('doctorDashboard.visits')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPacjenci.map(p => (
                <tr key={p.pacjentId}>
                  <td className="px-4 py-2 text-sm text-gray-900">{p.imie} {p.nazwisko}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{p.pesel || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{p.wizyty?.length ?? 0}</td>
                </tr>
              ))}
              {filteredPacjenci.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>
                    {t('adminDashboard.noPatients')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{t('adminDashboard.doctors')}</h3>
          <input
            value={lekarzFilter}
            onChange={(e) => setLekarzFilter(e.target.value)}
            placeholder="Filtruj po imieniu i nazwisku"
            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('myVisits.doctor')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('adminDashboard.specialization')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('adminDashboard.selectFacility')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLekarze.map(l => (
                <tr key={l.lekarzId}>
                  <td className="px-4 py-2 text-sm text-gray-900">{l.imie} {l.nazwisko}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{l.specjalizacja || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{l.placowka || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{l.username || l.email || '-'}</td>
                </tr>
              ))}
              {filteredLekarze.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>
                    {t('adminDashboard.noDoctors')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
