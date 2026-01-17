# Wkład w projekt AliMed

Dziękujemy za chęć wsparcia projektu! 

> 📖 **Pełna dokumentacja:** Zobacz [CONTRIBUTING.md](../CONTRIBUTING.md) w głównym katalogu projektu dla szczegółowych wytycznych dotyczących:
> - Branch strategy (Git Flow)
> - Konwencje commitów (Conventional Commits)
> - Code style (Backend .NET, Frontend React/TypeScript)
> - Proces review i testowania
> - Zasady bezpieczeństwa

## Szybki start

### Zgłaszanie błędów
- Użyj szablonu zgłoszenia błędu dostępnego w katalogu `.github/ISSUE_TEMPLATE/`.
- Dołącz kroki reprodukcji oraz oczekiwane zachowanie.
- Jeśli to możliwe, dodaj zrzuty ekranu lub logi.

### Propozycje funkcji
- Skorzystaj z szablonu propozycji funkcji.
- Opisz problem, który chcesz rozwiązać, oraz jego potencjalny wpływ na użytkowników.

### Pull requesty
- Utwórz branch: `feature/nazwa` lub `bugfix/nazwa`
- Użyj Conventional Commits: `feat:`, `fix:`, `docs:`, etc.
- Upewnij się, że kod jest zbudowany i przetestowany lokalnie.
- Dołącz opis zmian oraz odniesienie do powiązanego zgłoszenia.
- Poproś o review min. 2 osób z zespołu

## Standardy kodu
- **Backend:** Używaj `WebAPI/API.Alimed/` (nie `API/API.AliMed/`)
- **Frontend:** `src/frontend/AliMed.Web/`
- Stosuj istniejącą strukturę katalogów (`src/`, `test/`, `res/` itd.).
- Uruchom testy przed PR: `dotnet test` i `npm run lint`

## ⚠️ Bezpieczeństwo
**NIE commituj:** haseł, API keys, connection stringów, tokenów!  
**Używaj:** `.env`, `appsettings.Development.json` (są w .gitignore)

