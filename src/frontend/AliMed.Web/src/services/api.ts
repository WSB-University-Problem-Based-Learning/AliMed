import type { Pacjent, Lekarz, Wizyta } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiService = {
  // Pacjenci
  async getPacjenci(): Promise<Pacjent[]> {
    const response = await fetch(`${API_BASE_URL}/pacjenci`);
    if (!response.ok) throw new Error('Failed to fetch pacjenci');
    return response.json();
  },

  async getPacjentById(id: number): Promise<Pacjent> {
    const response = await fetch(`${API_BASE_URL}/pacjenci/${id}`);
    if (!response.ok) throw new Error('Failed to fetch pacjent');
    return response.json();
  },

  // Lekarze
  async getLekarze(): Promise<Lekarz[]> {
    const response = await fetch(`${API_BASE_URL}/lekarze`);
    if (!response.ok) throw new Error('Failed to fetch lekarze');
    return response.json();
  },

  async getLekarzById(id: number): Promise<Lekarz> {
    const response = await fetch(`${API_BASE_URL}/lekarze/${id}`);
    if (!response.ok) throw new Error('Failed to fetch lekarz');
    return response.json();
  },

  // Wizyty
  async getWizyty(): Promise<Wizyta[]> {
    const response = await fetch(`${API_BASE_URL}/wizyty`);
    if (!response.ok) throw new Error('Failed to fetch wizyty');
    return response.json();
  },

  async getWizytaById(id: number): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/wizyty/${id}`);
    if (!response.ok) throw new Error('Failed to fetch wizyta');
    return response.json();
  },

  async createWizyta(wizyta: Omit<Wizyta, 'wizytaId'>): Promise<Wizyta> {
    const response = await fetch(`${API_BASE_URL}/wizyty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wizyta),
    });
    if (!response.ok) throw new Error('Failed to create wizyta');
    return response.json();
  },
};
