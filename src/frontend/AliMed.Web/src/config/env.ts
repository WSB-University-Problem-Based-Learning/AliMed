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
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export default config;
