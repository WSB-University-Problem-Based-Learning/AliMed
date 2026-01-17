# ⚠️ UWAGA

Ten folder `API/API.AliMed` zawiera **starą wersję** backendu.

## Aktualna wersja backendu

Pełna, działająca implementacja backendu znajduje się w:

```
WebAPI/API.Alimed/
```

## Różnice

- **API/API.AliMed** - stara wersja Minimal API, brak kontrolerów
- **WebAPI/API.Alimed** - pełna implementacja z:
  - ✅ Kontrolerami (AuthController, PacjenciController, LekarzeController, WizytyController)
  - ✅ JWT Authentication
  - ✅ Swagger
  - ✅ CORS configuration
  - ✅ DTOs i Services
  - ✅ Testami jednostkowymi

## Co robić?

Używaj **WebAPI/API.Alimed** dla development i production.

Ten folder może zostać usunięty w przyszłości lub służy jako referencja do poprzedniej architektury.
