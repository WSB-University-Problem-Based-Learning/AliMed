# AliMed Web Frontend

Frontend aplikacji AliMed - Internetowego Systemu Rejestracji Pacjentów.

## 🛠️ Technologie

- **React 19** - Biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Vite** - Build tool i dev server
- **Tailwind CSS** - Framework CSS
- **Headless UI** - Komponenty dostępnościowe

## 🚀 Uruchomienie

### Instalacja zależności
```bash
npm install
```

### Konfiguracja
Skopiuj plik `.env.example` do `.env` i ustaw adres API:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Tryb deweloperski
```bash
npm run dev
```

### Build produkcyjny
```bash
npm run build
```

### Preview buildu
```bash
npm run preview
```

## 📁 Struktura projektu

```
src/
├── components/     # Komponenty wielokrotnego użytku
│   ├── Layout.tsx
│   └── Card.tsx
├── pages/          # Strony aplikacji
│   ├── HomePage.tsx
│   └── PacjenciPage.tsx
├── services/       # Serwisy API
│   └── api.ts
├── types/          # Definicje typów TypeScript
│   └── api.ts
├── App.tsx         # Główny komponent
└── main.tsx        # Entry point
```

## 🎨 Paleta kolorów

- `#1673b2` - AliMed Blue (kolor przewodni)
- `#4cb4e3` - AliMed Light Blue (odcień uzupełniający)
- `#acd045` - AliMed Green (akcent pozytywny)

Kolory dostępne w Tailwind jako: `alimed-blue`, `alimed-light-blue`, `alimed-green`

## 🔌 API Integration

Aplikacja komunikuje się z backendem przez REST API. 

### Uwierzytelnienie
- `POST /api/auth/github` - Logowanie przez GitHub OAuth
  - Przyjmuje: `{ code: string }`
  - Zwraca: `{ token: string }`
  - Refresh token przechowywany jako HttpOnly cookie
- `POST /api/auth/refresh` - Odświeżenie tokenu dostępu (wymaga HttpOnly cookie)

### Endpointy zasobów (wymagają autoryzacji)

#### Pacjenci
- `GET /api/authorizedendpoint/pacjenci` - Lista pacjentów (wymaga roli User)
- `GET /api/authorizedendpoint/pacjenci/{id}` - Szczegóły pacjenta

#### Lekarze
- `GET /api/authorizedendpoint/lekarze` - Lista lekarzy (wymaga roli User)
- `GET /api/authorizedendpoint/lekarze/{id}` - Szczegóły lekarza

#### Wizyty
- `GET /api/wizyty/moje-wizyty` - Moje wizyty (wymaga roli User)
- `GET /api/wizyty/{id}` - Szczegóły wizyty
- `POST /api/wizyty/umow-wizyte` - Umówienie wizyty (wymaga roli User)
- `GET /api/wizyty/dostepne` - Dostępne terminy wizyt

### Bezpieczeństwo
- Tokeny JWT przechowywane w localStorage
- Refresh token przechowywany jako HttpOnly cookie dla zwiększonego bezpieczeństwa
- Wszystkie zapytania do API wykorzystują `credentials: 'include'` dla obsługi cookies
- Bearer token w nagłówku `Authorization` dla uwierzytelnionych żądań

## 👥 Zespół (Grupa nr 3)

- Grzegorz Matusewicz
- Julia Łopata
- Szymon Małota
- Damian Litewka
- Łukasz Antoniewicz
- Aleksander Kutycki

