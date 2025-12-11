export interface Pacjent {
  pacjentId: number;
  imie?: string;
  nazwisko?: string;
  pesel?: string;
  adresZamieszkania?: Adres;
  dataUrodzenia: string;
  userId?: string;
}

export interface Adres {
  ulica?: string;
  numerDomu?: string;
  numerMieszkania?: string;
  kodPocztowy?: string;
  miasto?: string;
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
  pacjentId?: number;
  lekarzId?: number;
  placowkaId?: number;
  pacjent?: Pacjent;
  lekarz?: Lekarz;
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
