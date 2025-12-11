import type { Pacjent, Lekarz, Wizyta, AuthResponse } from '../types/api';
import { config } from '../config/env';

const API_BASE_URL = config.apiBaseUrl;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('alimed_token');
};

// Helper function to create headers with auth
const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const apiService = {
  // Authentication
  async loginWithGithub(code: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/github`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code }),
      credentials: 'include', // Include cookies for refresh token
    });
    if (!response.ok) throw new Error('Failed to authenticate with GitHub');
    const data = await response.json();
    // Backend returns only 'token', but refresh token is in HttpOnly cookie
    return {
      token: data.token,
      refreshToken: '', // Refresh token is handled via HttpOnly cookie
    };
  },

  // Pacjenci (requires User role)
  async getPacjenci(): Promise<Pacjent[]> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/pacjenci`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch pacjenci');
    return response.json();
  },

  async getPacjentById(id: number): Promise<Pacjent> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/pacjenci/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch pacjent');
    return response.json();
  },

  // Lekarze (requires User role)
  async getLekarze(): Promise<Lekarz[]> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/lekarze`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch lekarze');
    return response.json();
  },

  async getLekarzById(id: number): Promise<Lekarz> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/lekarze/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch lekarz');
    return response.json();
  },

  // Wizyty - Use dedicated WizytyController endpoints
  async getWizyty(): Promise<Wizyta[]> {
    const response = await fetch(`${API_BASE_URL}/api/wizyty/moje-wizyty`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch wizyty');
    return response.json();
  },

  async getWizytaById(id: number): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/api/wizyty/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch wizyta');
    return response.json();
  },

  async createWizyta(wizyta: Omit<Wizyta, 'wizytaId'>): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/api/wizyty/umow-wizyte`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(wizyta),
    });
    if (!response.ok) throw new Error('Failed to create wizyta');
    return response.json();
  },

  // Refresh token - call backend refresh endpoint
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send HttpOnly cookie
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    return response.json();
  },
};
