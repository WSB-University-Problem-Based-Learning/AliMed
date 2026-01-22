import type { Pacjent, Lekarz, Wizyta, WizytaDetail, AuthResponse, Dokument, DokumentCreateRequest, DokumentUpdateDto, RegisterRequest, LoginRequest, WizytaCreateRequest, DostepneTerminyResponse, Placowka, UpdatePacjentProfileRequest, AdminUserSummary, PromoteToDoctorRequest, LekarzWizytaSummary, AdminPacjentSummary, AdminLekarzSummary, LekarzPacjentDetails, LekarzProfil } from '../types/api';
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

const normalizeStatus = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === 'odbyta') {
      return 'Zrealizowana';
    }
    return trimmed;
  }
  if (typeof value === 'number') {
    switch (value) {
      case 0:
        return 'Zaplanowana';
      case 1:
        return 'Zrealizowana';
      case 2:
        return 'Anulowana';
      case 3:
        return 'Nieobecnosc';
      default:
        return String(value);
    }
  }
  return value != null ? String(value) : undefined;
};

const normalizeLekarzName = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }
  if (value && typeof value === 'object') {
    const lekarz = value as { imie?: string; nazwisko?: string };
    const fullName = [lekarz.imie, lekarz.nazwisko].filter(Boolean).join(' ');
    return fullName || undefined;
  }
  return value != null ? String(value) : undefined;
};

export const apiService = {
  // Authentication - GitHub OAuth
  async loginWithGithub(code: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/Auth/github`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
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
    const response = await fetch(`${API_BASE_URL}/api/AuthorizedEndpoint/pacjenci`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch pacjenci');
    return response.json();
  },

  async getPacjentById(id: number): Promise<Pacjent> {
    const response = await fetch(`${API_BASE_URL}/api/AuthorizedEndpoint/pacjenci/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch pacjent');
    return response.json();
  },

  // Lekarze (requires User role)
  async getLekarze(): Promise<Lekarz[]> {
    const response = await fetch(`${API_BASE_URL}/api/AuthorizedEndpoint/lekarze`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch lekarze');
    return response.json();
  },

  async getLekarzById(id: number): Promise<Lekarz> {
    const response = await fetch(`${API_BASE_URL}/api/AuthorizedEndpoint/lekarze/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch lekarz');
    return response.json();
  },

  // Wizyty - Use dedicated WizytyController endpoints
  async getWizyty(): Promise<Wizyta[]> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/moje-wizyty`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch wizyty');
    const data = await response.json();
    return data.map((w: any) => ({
      wizytaId: w.wizytaId,
      dataWizyty: w.dataWizyty,
      status: normalizeStatus(w.status),
      czyOdbyta: normalizeStatus(w.status) === 'Zrealizowana',
      lekarzName: normalizeLekarzName(w.lekarz),
      specjalizacja: w.specjalizacja ?? w.lekarz?.specjalizacja,
      placowka: w.placowka,
    }));
  },

  async getWizytaById(id: number): Promise<WizytaDetail> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch wizyta');
    const data = await response.json();
    return {
      wizytaId: data.wizytaId,
      dataWizyty: data.dataWizyty,
      status: normalizeStatus(data.status),
      diagnoza: data.diagnoza,
      lekarz: normalizeLekarzName(data.lekarz),
      specjalizacja: data.specjalizacja ?? data.lekarz?.specjalizacja,
      placowka: data.placowka,
      dokumenty: data.dokumenty || [],
    };
  },

  async createWizyta(wizyta: WizytaCreateRequest): Promise<{ message: string; wizytaId: number }> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/umow-wizyte`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/dostepne-terminy?${qs}`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Placowki`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dokumenty');
    return response.json();
  },

  async getDokumentById(id: number): Promise<Dokument> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty/${id}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dokument');
    return response.json();
  },

  async downloadDokument(id: number): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty/${id}/download`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to download dokument');
    return response.blob();
  },

  async createDokument(data: DokumentCreateRequest): Promise<Dokument> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create dokument');
    }
    return response.json();
  },

  async oznaczWizyteOdbyta(id: number, diagnoza: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/${id}/odbyta`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(diagnoza),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update visit status');
    }
  },

  async cancelWizyta(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/${id}/anuluj`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to cancel visit');
    }
  },

  async markWizytaNieobecnosc(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Wizyty/${id}/nieobecnosc`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to mark absence');
    }
  },

  async getDokumentyWizyty(wizytaId: number): Promise<Dokument[]> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty/wizyty/${wizytaId}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch visit documents');
    return response.json();
  },

  async getDokumentyWizytyLekarz(wizytaId: number): Promise<Dokument[]> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty/wizyty/${wizytaId}/lekarz`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch visit documents');
    return response.json();
  },

  async updateDokument(id: number, data: DokumentUpdateDto): Promise<Dokument> {
    const response = await fetch(`${API_BASE_URL}/api/Dokumenty/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update document');
    }
    return response.json();
  },

  // Refresh token - call backend refresh endpoint
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/api/Auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send HttpOnly cookie
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    return response.json();
  },

  // Logout - revoke refresh token on backend
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/logout`, {
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
    const response = await fetch(`${API_BASE_URL}/api/Pacjenci/moj-profil`, {
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
  async updateMojProfil(payload: UpdatePacjentProfileRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Pacjenci/moj-profil`, {
      method: 'PUT',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update profile');
    }
  },

  // Admin
  async getAdminUsers(): Promise<AdminUserSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/Admin/users`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin users');
    return response.json();
  },

  async promoteUserToDoctor(userId: string, data: PromoteToDoctorRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/Admin/users/${userId}/promote-to-doctor`, {
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

  async getAdminPacjenci(): Promise<AdminPacjentSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/Admin/pacjenci`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin patients');
    return response.json();
  },

  async getAdminLekarze(): Promise<AdminLekarzSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/Admin/lekarze`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin doctors');
    return response.json();
  },

  // Lekarz
  mapLekarzWizyta(data: any): LekarzWizytaSummary {
    return {
      wizytaId: data.wizytaId,
      dataWizyty: data.dataWizyty,
      status: normalizeStatus(data.status) || String(data.status ?? ''),
      pacjentId: data.pacjentId,
      pacjent: data.pacjent,
      diagnoza: data.diagnoza,
    };
  },

  async getLekarzWizytyDzien(date: string): Promise<LekarzWizytaSummary[]> {
    const qs = new URLSearchParams({ date }).toString();
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/moje-wizyty/dzien?${qs}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor day visits');
    const data = await response.json();
    return data.map((row: any) => this.mapLekarzWizyta(row));
  },

  async getLekarzWizytyTydzien(date: string): Promise<LekarzWizytaSummary[]> {
    const qs = new URLSearchParams({ date }).toString();
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/moje-wizyty/tydzien?${qs}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor week visits');
    const data = await response.json();
    return data.map((row: any) => this.mapLekarzWizyta(row));
  },

  async getLekarzWizytyMiesiac(date: string): Promise<LekarzWizytaSummary[]> {
    const d = new Date(date);
    const year = d.getUTCFullYear().toString();
    const month = (d.getUTCMonth() + 1).toString();
    const qs = new URLSearchParams({ year, month }).toString();
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/moje-wizyty/miesiac?${qs}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor month visits');
    const data = await response.json();
    return data.map((row: any) => this.mapLekarzWizyta(row));
  },

  async getLekarzWizyty(): Promise<LekarzWizytaSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/moje-wizyty`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor visits');
    const data = await response.json();
    return data.map((row: any) => this.mapLekarzWizyta(row));
  },

  async getLekarzPacjenci(query?: string): Promise<Pacjent[]> {
    const qs = query ? `?${new URLSearchParams({ query }).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/pacjenci${qs}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor patients');
    return response.json();
  },

  async getLekarzPacjentById(pacjentId: number): Promise<LekarzPacjentDetails> {
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/pacjenci/${pacjentId}`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch patient details');
    const data = await response.json();
    const adres = data.adresZamieszkania ?? data.adres;
    return {
      pacjentId: data.pacjentId,
      imie: data.imie,
      nazwisko: data.nazwisko,
      pesel: data.pesel,
      dataUrodzenia: data.dataUrodzenia,
      email: data.email,
      adresZamieszkania: adres ? {
        ulica: adres.ulica,
        numerDomu: adres.numerDomu,
        kodPocztowy: adres.kodPocztowy,
        miasto: adres.miasto,
        kraj: adres.kraj,
      } : undefined,
      wizyty: (data.wizyty || []).map((w: any) => ({
        wizytaId: w.wizytaId,
        dataWizyty: w.dataWizyty,
        status: normalizeStatus(w.status),
        diagnoza: w.diagnoza,
        dokumenty: (w.dokumenty || []).map((d: any) => ({
          dokumentId: d.dokumentId,
          nazwaPliku: d.nazwaPliku,
          typDokumentu: d.typDokumentu,
          opis: d.opis,
          dataUtworzenia: d.dataUtworzenia,
          wizytaId: w.wizytaId,
          pacjentId: data.pacjentId,
        })),
      })),
    };
  },

  async getLekarzProfil(): Promise<LekarzProfil> {
    const response = await fetch(`${API_BASE_URL}/api/Lekarze/moj-profil`, {
      headers: getHeaders(true),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch doctor profile');
    const data = await response.json();
    return {
      lekarzId: data.lekarzId,
      imie: data.imie,
      nazwisko: data.nazwisko,
      specjalizacja: data.specjalizacja,
      email: data.email,
      placowkaId: data.placowkaId,
    };
  },
};
