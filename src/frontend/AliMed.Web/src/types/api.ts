export interface Pacjent {
  pacjentId: number;
  imie?: string;
  nazwisko?: string;
  pesel?: string;
  adresZamieszkania?: Adres;
  dataUrodzenia: string;
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
  placowkaId: number;
}

export interface Wizyta {
  wizytaId: number;
  dataWizyty: string;
  diagnoza?: string;
  czyOdbyta: boolean;
  pacjentId: number;
  lekarzId: number;
  placowkaId: number;
  pacjent?: Pacjent;
  lekarz?: Lekarz;
}

export interface Placowka {
  placowkaId: number;
  nazwa?: string;
  adres?: Adres;
}
