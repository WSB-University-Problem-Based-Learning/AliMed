# 🤝 Contributing to AliMed

Dziękujemy za zainteresowanie współpracą nad projektem AliMed! Ten dokument zawiera wytyczne, które pomogą Ci efektywnie pracować z zespołem.

## 📋 Zasady pracy z Git

### Branch Strategy

Używamy **Git Flow** z następującymi branchami:

- `main` - produkcyjny kod, stabilne wydania
- `feature/frontend` - rozwój frontendu (React + TypeScript)
- `feature/backend` - rozwój backendu (.NET Web API)
- `feature/*` - nowe funkcjonalności (np. `feature/notifications`)
- `bugfix/*` - poprawki błędów (np. `bugfix/login-issue`)
- `hotfix/*` - pilne poprawki na produkcji

### Konwencje commitów

Używamy **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>
```

**Typy commitów:**
- `feat:` - nowa funkcjonalność
- `fix:` - poprawka błędu
- `docs:` - zmiany w dokumentacji
- `style:` - formatowanie, brakujące średniki, itp.
- `refactor:` - refaktoryzacja kodu
- `test:` - dodanie lub poprawka testów
- `chore:` - zmiany w toolingu, konfiguracji

**Przykłady:**
```bash
feat(auth): add JWT refresh token mechanism
fix(wizyty): correct date validation in booking form
docs(readme): update installation instructions
chore(deps): upgrade React to v19
```

### Pull Requests

1. **Przed rozpoczęciem pracy:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/twoja-funkcjonalnosc
   ```

2. **Podczas pracy:**
   - Commituj często z opisowymi wiadomościami
   - Regularnie merguj zmiany z głównego brancha
   ```bash
   git fetch origin
   git merge origin/main
   ```

3. **Przed utworzeniem PR:**
   - Upewnij się że kod się kompiluje
   - Uruchom testy
   - Uruchom linter
   ```bash
   # Backend
   cd WebAPI/API.Alimed
   dotnet build
   dotnet test
   
   # Frontend
   cd src/frontend/AliMed.Web
   npm run build
   npm run lint
   ```

4. **Tworzenie Pull Request:**
   - Użyj opisowego tytułu (jak commit message)
   - Wypełnij szablon PR (jeśli istnieje)
   - Dodaj screenshoty dla zmian w UI
   - Połącz z issue (jeśli dotyczy)
   - Poproś o review 2 osoby z zespołu

## 🔒 Bezpieczeństwo

### ❌ NIE commituj:
- Haseł do baz danych
- API keys
- GitHub Client ID/Secret
- Tokenów JWT
- Connection stringów z produkcji

### ✅ Używaj:
- `.env` dla zmiennych lokalnych (jest w .gitignore)
- `appsettings.Development.json` dla .NET (jest w .gitignore)
- Placeholderów w plikach `.example`
- Oracle Cloud Vault / Azure Key Vault dla produkcji

## 🏗️ Struktura projektu

```
AliMed/
├── WebAPI/API.Alimed/        # 👈 BACKEND - tutaj pracuj
├── src/frontend/AliMed.Web/  # 👈 FRONTEND - tutaj pracuj
├── API/API.AliMed/           # ⚠️ DEPRECATED - nie używaj
└── doc/                      # Dokumentacja
```

## 🧪 Testowanie

### Backend
```bash
cd WebAPI/API.Alimed.Tests
dotnet test
```

### Frontend
```bash
cd src/frontend/AliMed.Web
npm run lint
npm run build
```

## 📝 Code Style

### Backend (.NET)
- Używaj C# 12 features
- Async/await dla I/O operations
- LINQ where possible
- XML comments dla publicznych API
- Nullable reference types enabled

### Frontend (React/TypeScript)
- Functional components z hooks
- TypeScript strict mode
- ESLint + Prettier
- Komponenty w oddzielnych plikach
- Props interfaces dla każdego komponentu

## 🆘 Potrzebujesz pomocy?

- **Dokumentacja:** [README.md](README.md), [QUICKSTART.md](QUICKSTART.md)
- **Problemy:** Utwórz issue na GitHubie
- **Pytania:** Zapytaj na kanale zespołu

## 👥 Code Review

Przy review zwracamy uwagę na:
- ✅ Kod działa i jest przetestowany
- ✅ Spełnia wymagania funkcjonalne
- ✅ Jest czytelny i dobrze udokumentowany
- ✅ Nie wprowadza technical debt
- ✅ Nie łamie istniejącej funkcjonalności
- ✅ Używa odpowiednich wzorców projektowych

## 📅 Release Process

1. Merge feature branches do `main`
2. Update `CHANGELOG.md`
3. Tag release (e.g., `v1.0.0`)
4. Deploy via GitHub Actions

---

**Dziękujemy za współpracę! 🎉**
