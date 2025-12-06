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
    });
    if (!response.ok) throw new Error('Failed to authenticate with GitHub');
    return response.json();
  },

  // Pacjenci (requires Admin role)
  async getPacjenci(): Promise<Pacjent[]> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/pacjenci`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch pacjenci');
    return response.json();
  },

  async getPacjentById(id: number): Promise<Pacjent> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/pacjenci/${id}`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch pacjent');
    return response.json();
  },

  // Lekarze (requires User role)
  async getLekarze(): Promise<Lekarz[]> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/lekarze`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch lekarze');
    return response.json();
  },

  async getLekarzById(id: number): Promise<Lekarz> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/lekarze/${id}`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch lekarz');
    return response.json();
  },

  // Wizyty
  async getWizyty(): Promise<Wizyta[]> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/wizyty`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch wizyty');
    return response.json();
  },

  async getWizytaById(id: number): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/wizyty/${id}`, {
      headers: getHeaders(true),
    });
    if (!response.ok) throw new Error('Failed to fetch wizyta');
    return response.json();
  },

  async createWizyta(wizyta: Omit<Wizyta, 'wizytaId'>): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/api/authorizedendpoint/wizyty`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(wizyta),
    });
    if (!response.ok) throw new Error('Failed to create wizyta');
    return response.json();
  },
};
