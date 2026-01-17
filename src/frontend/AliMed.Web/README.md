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

Aplikacja komunikuje się z backendem przez REST API. Endpointy:

- `GET /pacjenci` - Lista pacjentów
- `GET /pacjenci/{id}` - Szczegóły pacjenta
- `GET /lekarze` - Lista lekarzy
- `GET /lekarze/{id}` - Szczegóły lekarza
- `GET /wizyty` - Lista wizyt
- `POST /wizyty` - Utworzenie wizyty

## 👥 Zespół (Grupa nr 3)

- Grzegorz Matusewicz
- Julia Łopata
- Szymon Małota
- Damian Litewka
- Łukasz Antoniewicz
- Aleksander Kutycki

