import type { Pacjent, Lekarz, Wizyta, AuthResponse, Dokument, RegisterRequest, LoginRequest, WizytaCreateRequest, DostepneTerminyResponse, Placowka, AdminUserSummary, PromoteToDoctorRequest } from '../types/api';
import { config } from '../config/env';

const API_BASE_URL = config.apiBaseUrl;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('alimed_token');
};

// Helper function to create headers with auth
const getHeaders = (includeAuth = false): Record<string, string> => {
  const headers: Record<string, string> = {
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
  // Authentication - GitHub OAuth
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

  // Authentication - Local login (email + password)
  async loginLocal(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Niepoprawny email lub hasło');
    }
    const data = await response.json();
    return {
      token: data.token,
      refreshToken: '',
    };
  },

  // Authentication - Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Nie udało się utworzyć konta');
    }
    const result = await response.json();
    return {
      token: result.token,
      refreshToken: '',
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

  async createWizyta(wizyta: WizytaCreateRequest): Promise<{ message: string; wizytaId: number }> {
    const response = await fetch(`${API_BASE_URL}/api/wizyty/umow-wizyte`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(wizyta),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create wizyta');
    }
    return response.json();
  },

  // Wizyty - dostępne terminy (sloty)
  async getDostepneTerminy(
    lekarzId: number,
    placowkaId: number,
    from: string,
    to: string,
  ): Promise<DostepneTerminyResponse> {
    const qs = new URLSearchParams({
      lekarzId: String(lekarzId),
      placowkaId: String(placowkaId),
      from,
      to,
    }).toString();
    const response = await fetch(`${API_BASE_URL}/api/wizyty/dostepne-terminy?${qs}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch available slots');
    }
    return response.json();
  },

  // Placówki
  async getPlacowki(): Promise<Placowka[]> {
    const response = await fetch(`${API_BASE_URL}/api/placowki`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch placowki');
    // Map API response to Placowka type (API returns Adres instead of adresPlacowki)
    const data = await response.json();
    return data.map((p: { placowkaId: number; nazwa?: string; adres?: { miasto?: string; ulica?: string } }) => ({
      placowkaId: p.placowkaId,
      nazwa: p.nazwa,
      adresPlacowki: p.adres ? {
        miasto: p.adres.miasto,
        ulica: p.adres.ulica,
      } : undefined,
    }));
  },

  // Dokumenty
  async getDokumenty(): Promise<Dokument[]> {
    const response = await fetch(`${API_BASE_URL}/api/dokumenty`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dokumenty');
    return response.json();
  },

  async getDokumentById(id: number): Promise<Dokument> {
    const response = await fetch(`${API_BASE_URL}/api/dokumenty/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dokument');
    return response.json();
  },

  async downloadDokument(id: number): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/dokumenty/${id}/download`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to download dokument');
    return response.blob();
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

  // Logout - revoke refresh token on backend
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include', // Send HttpOnly cookie to revoke it
      });
      if (!response.ok) {
        console.error('Failed to logout on backend');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Get current user's patient profile
  async getMojProfil(): Promise<Pacjent> {
    const response = await fetch(`${API_BASE_URL}/api/pacjenci/moj-profil`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch patient profile');
    const data = await response.json();
    return {
      pacjentId: data.pacjentId,
      imie: data.imie,
      nazwisko: data.nazwisko,
      pesel: data.pesel,
      dataUrodzenia: data.dataUrodzenia,
      email: data.email,
      adresZamieszkania: data.adres ? {
        ulica: data.adres.ulica,
        numerDomu: data.adres.numerDomu,
        kodPocztowy: data.adres.kodPocztowy,
        miasto: data.adres.miasto,
        kraj: data.adres.kraj,
      } : undefined,
      userId: undefined,
    };
  },

  // Update current user's patient profile
  async updateMojProfil(data: import('../types/api').UpdatePacjentProfileRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/pacjenci/moj-profil`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update profile');
    }
    return response.json();
  },

  // Admin
  async getAdminUsers(): Promise<AdminUserSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin users');
    return response.json();
  },

  async promoteUserToDoctor(userId: string, data: PromoteToDoctorRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote-to-doctor`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to promote user');
    }
    return response.json();
  },
};
