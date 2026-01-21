export interface Pacjent {
  pacjentId: number;
  imie?: string;
  nazwisko?: string;
  pesel?: string;
  adresZamieszkania?: Adres;
  dataUrodzenia: string;
  userId?: string;
  email?: string;
}

export interface Adres {
  ulica?: string;
  numerDomu?: string;
  kodPocztowy?: string;
  miasto?: string;
  kraj?: string;
}

export interface Lekarz {
  lekarzId: number;
  imie?: string;
  nazwisko?: string;
  specjalizacja?: string;
  placowkaId?: number;
}

export interface Wizyta {
  wizytaId: number;
  dataWizyty: string;
  diagnoza?: string;
  czyOdbyta: boolean;
  status?: string;
  pacjentId?: number;
  lekarzId?: number;
  placowkaId?: number;
  pacjent?: Pacjent;
  lekarz?: Lekarz;
  lekarzName?: string;
  specjalizacja?: string;
  placowka?: Placowka | string;
}

export interface Placowka {
  placowkaId: number;
  nazwa?: string;
  adresPlacowki?: Adres;
  numerKonta?: string;
}

export interface User {
  userId: string;
  githubId?: string;
  githubName?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export type UserRole = 0 | 1 | 2; // User = 0, Lekarz = 1, Admin = 2

export const UserRoleEnum = {
  User: 0 as const,
  Lekarz: 1 as const,
  Admin: 2 as const,
} as const;

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface ZaleceniaDokument {
  id: string;
  nazwaPliku: string;
  zawartoscPliku: Uint8Array;
  dataUtworzenia: string;
}

export interface Dokument {
  dokumentId: number;
  nazwaPliku?: string;
  typDokumentu?: string;
  opis?: string;
  dataUtworzenia: string;
  rozmiarPliku?: number;
  wizytaId?: number;
  pacjentId?: number;
}

export interface WizytaDetail {
  wizytaId: number;
  dataWizyty: string;
  status?: string;
  diagnoza?: string;
  lekarz?: string;
  specjalizacja?: string;
  placowka?: string;
  dokumenty: Dokument[];
}

export interface DokumentCreateRequest {
  wizytaId: number;
  typDokumentu: string;
  nazwaPliku?: string;
  opis?: string;
  tresc?: string;
}

export interface DokumentUpdateDto {
  typDokumentu: string;
  nazwaPliku?: string;
  opis?: string;
  tresc?: string;
}

// Request DTOs matching backend
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  pesel?: string;
  dataUrodzenia?: string;
  ulica?: string;
  numerDomu?: string;
  kodPocztowy?: string;
  miasto?: string;
  kraj?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface WizytaCreateRequest {
  dataWizyty: string;
  lekarzId?: number;
  placowkaId?: number;
  diagnoza?: string;
}

export interface UpdatePacjentProfileRequest {
  imie: string;
  nazwisko: string;
  pesel: string;
  dataUrodzenia: string;
  ulica: string;
  numerDomu: string;
  kodPocztowy: string;
  miasto: string;
  kraj: string;
}

// Wizyty: dostępne terminy odpowiedź
export interface DostepneTerminyResponse {
  lekarzId: number;
  placowkaId: number;
  from: string; // ISO date (yyyy-mm-dd)
  to: string;   // ISO date (yyyy-mm-dd)
  available: string[]; // ISO datetimes (e.g., 2026-01-22T09:30:00)
}

export interface LekarzWizytaSummary {
  wizytaId: number;
  dataWizyty: string;
  status: string;
  pacjentId?: number;
  pacjent: string;
  diagnoza?: string;
}

export interface AdminUserSummary {
  userId: string;
  username?: string;
  email?: string;
  role: string;
  isGithubUser: boolean;
  hasPacjent: boolean;
  hasLekarz: boolean;
}

export interface PromoteToDoctorRequest {
  specjalizacja: string;
  placowkaId: number;
}

export interface AdminPacjentSummary {
  pacjentId: number;
  imie?: string;
  nazwisko?: string;
  pesel?: string;
  dataUrodzenia?: string;
  wizyty?: Array<{
    wizytaId: number;
    dataWizyty: string;
    status: string;
    diagnoza?: string;
    lekarz?: string | null;
    specjalizacja?: string | null;
    placowka?: string | null;
    dokumenty?: Array<{
      dokumentId: number;
      nazwaPliku?: string;
      typDokumentu?: string;
      opis?: string;
      dataUtworzenia: string;
    }>;
  }>;
}

export interface AdminLekarzSummary {
  lekarzId: number;
  imie?: string;
  nazwisko?: string;
  specjalizacja?: string;
  placowkaId?: number;
  placowka?: string | null;
  userId?: string;
  email?: string | null;
  username?: string | null;
}
