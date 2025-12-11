# Changelog - Integracja z Backend testowanieEndpointow

## Data: 2025-12-11

### Zmiany wprowadzone w celu integracji frontendu z backendem

#### Problemy zidentyfikowane:
1. Backend zwracał tylko `token` w odpowiedzi na logowanie, podczas gdy frontend oczekiwał `token` i `refreshToken`
2. RefreshToken był przechowywany jako HttpOnly cookie po stronie backendu, ale frontend próbował go zapisać w localStorage
3. Brak obsługi `credentials: 'include'` w requestach HTTP - niezbędne dla działania HttpOnly cookies
4. Nieprawidłowe endpointy dla wizyt - frontend używał nieistniejących ścieżek

#### Wprowadzone poprawki:

##### 1. `src/services/api.ts`
- ✅ Dodano `credentials: 'include'` do wszystkich żądań HTTP dla obsługi HttpOnly cookies
- ✅ Zaktualizowano `loginWithGithub()` aby obsłużyć odpowiedź backendu zawierającą tylko `token`
- ✅ Dodano komentarz wyjaśniający że refreshToken jest w HttpOnly cookie
- ✅ Poprawiono endpointy dla wizyt:
  - `GET /api/wizyty/moje-wizyty` - pobieranie moich wizyt
  - `GET /api/wizyty/{id}` - szczegóły wizyty
  - `POST /api/wizyty/umow-wizyte` - umawianie wizyty
- ✅ Dodano nową metodę `refreshToken()` do odświeżania tokenu dostępu

##### 2. `src/context/AuthContext.tsx`
- ✅ Zaktualizowano `login()` aby nie zapisywać refreshToken w localStorage
- ✅ Dodano komentarz wyjaśniający że refreshToken jest zarządzany przez backend jako HttpOnly cookie
- ✅ Zaktualizowano `useEffect()` aby nie pobierać refreshToken z localStorage
- ✅ Usunięto niepotrzebne operacje na `alimed_refresh_token` w localStorage

##### 3. `src/config/env.ts`
- ✅ Zmieniono domyślny URL API z `http://43.106.30.243` na `http://localhost:5000`

##### 4. `.env.example`
- ✅ Zaktualizowano domyślny URL API na localhost dla środowiska deweloperskiego

##### 5. `README.md`
- ✅ Dodano szczegółową dokumentację endpointów API
- ✅ Opisano mechanizm uwierzytelniania przez GitHub OAuth
- ✅ Wyjaśniono obsługę tokenów JWT i HttpOnly cookies
- ✅ Dodano informacje o bezpieczeństwie i użyciu `credentials: 'include'`

#### Zgodność z backendem (branch: testowanieEndpointow)

##### Uwierzytelnianie
- ✅ `POST /api/auth/github` - logowanie przez GitHub
  - Backend zwraca: `{ token: string }`
  - Frontend obsługuje: token w localStorage, refreshToken w HttpOnly cookie
  
- ✅ `POST /api/auth/refresh` - odświeżanie tokenu
  - Wykorzystuje HttpOnly cookie automatycznie
  - Zwraca nowy accessToken

##### Endpointy zasobów
- ✅ Pacjenci: `/api/authorizedendpoint/pacjenci` (role: User)
- ✅ Lekarze: `/api/authorizedendpoint/lekarze` (role: User)
- ✅ Wizyty:
  - `/api/wizyty/moje-wizyty` - lista moich wizyt
  - `/api/wizyty/{id}` - szczegóły wizyty
  - `/api/wizyty/umow-wizyte` - umówienie wizyty

#### Bezpieczeństwo
- ✅ Access token (JWT) przechowywany w localStorage - krótki czas życia
- ✅ Refresh token przechowywany jako HttpOnly cookie - zabezpieczony przed XSS
- ✅ Wszystkie żądania do API używają `credentials: 'include'` dla cookies
- ✅ Bearer token w nagłówku Authorization dla uwierzytelnionych żądań

#### Uwagi dla deweloperów
1. Upewnij się że backend działa na porcie 5000 lub zaktualizuj `.env`
2. GitHub OAuth wymaga poprawnej konfiguracji redirect URI
3. W środowisku produkcyjnym należy ustawić `Secure: true` dla cookies
4. CORS musi być skonfigurowany na backendzie aby zezwalać na `credentials: 'include'`

#### Status
🟢 **Gotowe do testowania** - Frontend jest teraz w pełni kompatybilny z backendem z brancha `testowanieEndpointow`
