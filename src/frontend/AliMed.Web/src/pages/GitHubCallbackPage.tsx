import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useTranslation } from '../context/LanguageContext';

const GitHubCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double execution (React StrictMode)
      if (hasCalledRef.current) return;
      hasCalledRef.current = true;

      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(t('login.githubAuthError'));
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError(t('login.noAuthCode'));
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const response = await apiService.loginWithGithub(code);
        console.log('GitHub login response:', response);
        
        if (response.token) {
          login(response.token, response.refreshToken || '');
          // Small delay to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
        } else {
          throw new Error('No token in response');
        }
      } catch (err) {
        console.error('GitHub auth error:', err);
        setError(t('login.authFailed'));
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login, t]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="AliMed" className="h-20 w-auto" />
        </div>
        
        {error ? (
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              {t('login.error')}
            </h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">
              {t('login.redirecting')}
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t('login.authenticating')}
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alimed-blue"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallbackPage;
