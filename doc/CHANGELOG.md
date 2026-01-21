# Changelog

Wszelkie istotne zmiany w tym repozytorium będą dokumentowane w tym pliku.

## [Unreleased]

### Added
- ✨ System autentykacji JWT z refresh tokenami
- ✨ GitHub OAuth integration
- ✨ Pełne endpointy CRUD dla Pacjentów, Lekarzy, Wizyt
- ✨ Panel pacjenta z zarządzaniem wizytami
- ✨ Panel lekarza z listą pacjentów i wizyt
- ✨ Internacjonalizacja (PL/EN) z react-i18next
- ✨ Responsywny design z TailwindCSS 4
- ✨ Testy jednostkowe backendu
- ✨ Swagger documentation dla API
- ✨ Docker support
- ✨ GitHub Actions CI/CD workflow

### Changed
- 🔄 Zaktualizowano .NET do wersji 9.0
- 🔄 Zaktualizowano React do wersji 19
- 🔄 Migracja z Create React App na Vite
- 🔄 Ulepszono strukturę projektu

### Security
- 🔒 Usunięto wrażliwe dane z repozytorium
- 🔒 Dodano placeholder dla haseł w plikach konfiguracyjnych
- 🔒 Implementacja bezpiecznego przechowywania refresh tokenów w HttpOnly cookies

## [0.1.0] - 2025-01-17

### Added
- Zainicjowano standardową strukturę katalogów projektu
- Podstawowa konfiguracja Entity Framework Core z MySQL
- Definicje encji: Pacjent, Lekarz, Wizyta, Placówka
- Podstawowy setup frontendu z React i TypeScript

