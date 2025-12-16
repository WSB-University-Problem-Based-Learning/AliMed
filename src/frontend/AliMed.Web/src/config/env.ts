/**
 * Environment configuration
 * Validates and provides typed access to environment variables
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
  }
  
  return value || '';
};

export const config = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5045'),
  githubClientId: getEnvVar('VITE_GITHUB_CLIENT_ID', 'Ov23liVc5BhNQu3ak43m'),
  githubRedirectUri: getEnvVar('VITE_GITHUB_REDIRECT_URI', 'http://localhost:5173/auth/github/callback'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export default config;
