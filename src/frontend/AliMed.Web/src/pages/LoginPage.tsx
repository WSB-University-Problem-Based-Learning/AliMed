import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock auth - w przyszłości podpiąć pod backend
    if (email && password) {
      // Zapisz mock token
      localStorage.setItem('alimed_token', 'mock_jwt_token');
      localStorage.setItem('alimed_user', JSON.stringify({
        id: 1,
        imie: 'Anna',
        nazwisko: 'Kowalska',
        email: email
      }));
      navigate('/dashboard');
    } else {
      setError('Proszę wypełnić wszystkie pola');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="AliMed" className="h-20 w-auto" />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-8">
          Zaloguj się do AliMed
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-alimed-light-blue focus:border-transparent transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-alimed-light-blue focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-alimed-light-blue hover:bg-alimed-blue text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            zaloguj się
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-alimed-blue hover:underline text-sm">
            Zapomniałeś hasła?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
