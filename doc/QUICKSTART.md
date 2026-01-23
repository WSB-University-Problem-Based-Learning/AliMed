# AliMed - Quick Start Guide 🚀

## Szybkie uruchomienie z Docker Compose (zalecane)

### 1. Uruchom tylko bazę danych MySQL 9.5.2

```bash
docker-compose up -d mysql
```

Poczekaj aż MySQL będzie gotowy (ok. 30 sekund):
```bash
docker-compose logs -f mysql
# Zatrzymaj gdy zobaczysz: "ready for connections"
```

### 2. Uruchom backend ręcznie

```bash
cd WebAPI/API.Alimed

# Skonfiguruj connection string do Dockera
# W appsettings.Development.json użyj:
# "MySqlConnection": "Server=localhost;Port=3306;Database=alimed;Uid=alimed_user;Pwd=alimed_password"

dotnet restore
dotnet ef database update  # Jeśli są migracje
dotnet run
```

Backend będzie dostępny: **http://localhost:5056**  
Swagger docs: **http://localhost:5056/swagger**

#### Jak korzystać z Swagger UI?

1.  **Login**: Wykonaj `POST /api/Auth/login` (użyj danych demo), skopiuj `token` z odpowiedzi.
2.  **Authorize**: Kliknij kłódkę na górze strony, wpisz `Bearer <TWOJ_TOKEN>` i zatwierdź.
3.  **Test**: Teraz możesz wykonywać zapytania do zabezpieczonych endpointów (np. `/api/Wizyty/moje-wizyty`).

### 3. Uruchom frontend ręcznie

```bash
cd src/frontend/AliMed.Web

# Utwórz plik .env
echo "VITE_API_BASE_URL=http://localhost:5056" > .env
echo "VITE_GITHUB_CLIENT_ID=your_github_client_id" >> .env
echo "VITE_GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback" >> .env

npm install
npm run dev
```

Frontend będzie dostępny: **http://localhost:5173**

---

## Uruchomienie bez Dockera

### Wymagania
- Node.js 20+
- .NET 9.0 SDK
- MySQL 9.0+ zainstalowany lokalnie

### Kroki

1. **Uruchom MySQL lokalnie** i utwórz bazę:
```sql
CREATE DATABASE alimed;
CREATE USER 'alimed_user'@'localhost' IDENTIFIED BY 'alimed_password';
GRANT ALL PRIVILEGES ON alimed.* TO 'alimed_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Backend:**
```bash
cd WebAPI/API.Alimed
dotnet restore
dotnet run
```

3. **Frontend:**
```bash
cd src/frontend/AliMed.Web
npm install
npm run dev
```

---

## Demo konta (jeśli są seed data)

- **Admin:** admin@alimed.pl / admin123
- **Lekarz:** lekarz@alimed.pl / lekarz123
- **Pacjent:** pacjent@alimed.pl / pacjent123

---

## Przydatne komendy

```bash
# Sprawdź status kontenerów
docker-compose ps

# Zobacz logi
docker-compose logs -f

# Zatrzymaj wszystko
docker-compose down

# Zatrzymaj i usuń wolumeny (UWAGA: usuwa dane)
docker-compose down -v

# Rebuild po zmianach
docker-compose up -d --build
```

---

## Troubleshooting

### Backend nie może połączyć się z MySQL
- Sprawdź czy MySQL działa: `docker-compose ps`
- Sprawdź logi: `docker-compose logs mysql`
- Poczekaj 30-60 sekund na inicjalizację MySQL

### Frontend pokazuje błąd CORS
- Upewnij się że backend działa na porcie 5056
- Sprawdź czy w `.env` jest poprawny `VITE_API_BASE_URL`

### Port już zajęty
- MySQL: zmień `3306:3306` na `3307:3306` w docker-compose.yml
- Backend: zmień port w launchSettings.json
- Frontend: zmień port w vite.config.ts

---

**Potrzebujesz pomocy?** Sprawdź pełną dokumentację w [README.md](README.md)
