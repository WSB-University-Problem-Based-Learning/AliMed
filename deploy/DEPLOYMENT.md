# 🚀 Przewodnik Wdrożeniowy AliMed

Dokument ten szczegółowo opisuje proces automatycznego wdrażania (Deployment) aplikacji AliMed na środowisko produkcyjne, architekturę CI/CD oraz procedury obsługi serwera.

---

## 🏗️ Przegląd Architektury

System działa w środowisku **Oracle Cloud Infrastructure (OCI)** na maszynie wirtualnej z systemem **Ubuntu 24.04 LTS**.

*   **Frontend**: Aplikacja React (SPA) serwowana jako pliki statyczne przez serwer **Nginx**.
*   **Backend**: API .NET 9.0 działające jako usługa systemowa Linux (`systemd`).
*   **Baza Danych**: MySQL HeatWave (Managed Service w OCI).
*   **Automatyzacja**: Cały proces od commitu do wdrożenia jest zautomatyzowany przez **GitHub Actions**.

*   **Automatyzacja**: Cały proces od commitu do wdrożenia jest zautomatyzowany przez **GitHub Actions**.

---

## 🌐 Konfiguracja Sieciowa (Infrastructure)

System wykorzystuje model **Private Networking** w celu maksymalizacji bezpieczeństwa danych medycznych.

*   **VCN Name**: `Alimed-Network`
*   **CIDR**: `192.168.0.0/24` (Prywatna podsieć)
*   **Adresacja IP**:
    *   `192.168.0.218` -> **App Server** (Ubuntu VM)
    *   `192.168.0.251` -> **MySQL HeatWave DB** (Private Endpoint)

> **Bezpieczeństwo**: Baza danych nie posiada publicznego adresu IP. Komunikacja odbywa się wyłącznie wewnątrz sieci VCN.

---

## 🛡️ Bezpieczeństwo (Defense in Depth)

Zastosowano wielowarstwową strategię ochrony:

1.  **Security Lists (VCN Level)**: Otwierają tylko niezbędne porty dla całej podsieci (80, 443, 22).
2.  **Network Security Groups (Instance Level)**:
    *   Reguła `alimeddb-nsg`: Zezwala na ruch na porcie 3306 **TYLKO** z adresu IP serwera aplikacji (`192.168.0.218/32`).
3.  **SSH Tunneling**: Dostęp administracyjny do bazy możliwy jest tylko tunelem SSH przez serwer pośredniczący (Bastion Host / Management VM).

## 🔄 Jak to działa? (GitHub Actions Workflows)

Proces CI/CD składa się z trzech powiązanych ze sobą plików workflow (`.github/workflows/*.yml`).

### 1. Backend CI (`backend.yml`)
> **Plik:** [.github/workflows/backend.yml](../.github/workflows/backend.yml)

Ten proces uruchamia się automatycznie przy każdym wypchnięciu zmian (push) do katalogu `WebAPI/`.

**Kroki procesu:**
> **Strategia: Build Offloading**
> Maszyna produkcyjna posiada tylko ~1GB RAM, co uniemożliwia budowanie aplikacji na serwerze. Cały proces kompilacji odbywa się na runnerach GitHub, a na serwer trafiają tylko gotowe pliki.

1.  **Build**: Kompilacja kodu .NET 9.0.
2.  **Test**: Uruchomienie testów jednostkowych i integracyjnych.
3.  **Publish**: Stworzenie paczki wdrożeniowej (artefaktu) gotowej do uruchomienia na serwerze.
4.  **Upload Artifact**: Przesłanie gotowej paczki do tymczasowego magazynu GitHub, aby mogła zostać użyta w etapie wdrożenia.

### 2. Frontend CI (`frontend.yml`)
> **Plik:** [.github/workflows/frontend.yml](../.github/workflows/frontend.yml)

Uruchamia się przy zmianach w katalogu `src/frontend/`.

**Kroki procesu:**
1.  **Instalacja**: Pobranie zależności (`npm ci`).
2.  **Linting**: Sprawdzenie jakości kodu (`npm run lint`).
3.  **Build**: Budowanie wersji produkcyjnej aplikacji (`npm run build`) -> powstaje katalog `dist/`.
4.  **Upload Artifact**: Przesłanie katalogu `dist` jako artefaktu.

### 3. Deploy Orchestration (`deploy.yml`)
> **Plik:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

To jest **główny proces wdrażający**. Uruchamia się on **tylko wtedy**, gdy pomyślnie zakończą się workflowy `Backend CI` lub `Frontend CI` na głównej gałęzi (`main`).

**Co dokładnie się dzieje?**
1.  **Pobranie Artefaktów**: Skrypt pobiera zbudowane wcześniej pliki (z Backend CI lub Frontend CI).
2.  **Generowanie Konfiguracji**:
    *   Tworzony jest w locie plik `appsettings.Production.json` dla Backendu.
    *   Wrażliwe dane (hasła do bazy, klucze JWT) są wstrzykiwane z **GitHub Secrets** – nie ma ich w kodzie źródłowym!
3.  **Deploy Frontendu** (jeśli dotyczy):
    *   Wysyłka plików przez SSH (SCP) do katalogu `/home/ubuntu/www`.
4.  **Deploy Backendu** (jeśli dotyczy):
    *   Zatrzymanie usługi API (`sudo systemctl stop alimed-api`).
    *   Wysyłka plików binarnych do `/opt/alimed/api`.
    *   Ponowne uruchomienie usługi (`sudo systemctl start alimed-api`).

---

## 🔐 Zarządzanie Sekretami

Bezpieczeństwo procesu opiera się na **GitHub Secrets** (Settings -> Secrets and variables -> Actions). Wymagane są następujące zmienne:

| Nazwa Sekretu | Opis |
|---------------|------|
| `SSH_PRIVATE_KEY` | Prywatny klucz SSH umożliwiający logowanie do serwera jako użytkownik `ubuntu`. |
| `REMOTE_HOST` | Adres IP serwera produkcyjnego (`130.162.222.70`). |
| `REMOTE_USER` | Użytkownik systemowy (`ubuntu`). |
| `REMOTE_TARGET` | Ścieżka dla plików frontendu (`/home/ubuntu/www`). |
| `REMOTE_TARGET_BACKEND` | Ścieżka dla plików backendu (`/opt/alimed/api`). |
| `DB_CONNECTION_STRING` | Pełny connection string do bazy produkcyjnej MySQL. |
| `JWT_KEY` | Sekretny klucz do podpisywania tokenów autoryzacyjnych. |

---

## 🛠️ Obsługa Manualna Serwera

W razie problemów możesz zalogować się na serwer przez SSH, aby sprawdzić stan usług.

**Logowanie:**
```bash
ssh -i ~/.ssh/alimed.key ubuntu@130.162.222.70
```

### Sprawdzanie Statusu

Sprawdź, czy Backend działa:
```bash
sudo systemctl status alimed-api
```

Sprawdź, czy Serwer WWW (Nginx) działa:
```bash
sudo systemctl status nginx
```

### Logi (Diagnostyka)

Podgląd logów Backendu "na żywo":
```bash
# -u: nazwa usługi, -f: follow (śledzenie na bieżąco)
sudo journalctl -u alimed-api -f
```

Logi błędów serwera Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Restartowanie Usług

Jeśli wdrożenie się zawiesiło lub usługa padła:
```bash
# Restart API
sudo systemctl restart alimed-api

# Restart Nginx
sudo systemctl restart nginx
```

### Monitoring Dashboard (Custom MOTD)

Serwer posiada niestandardowy skrypt **Message of the Day (MOTD)**, który wyświetla kluczowe metryki od razu po zalogowaniu przez SSH:
*   Status usług (Nginx, API, DB).
*   Użycie pamięci i dysku.
*   Datę ostatniego backupu bazy danych.

---

## 📂 Pliki Konfiguracyjne na Serwerze

Pewne pliki nie znajdują się w repozytorium GitHub ze względów bezpieczeństwa lub specyfiki środowiska.

1.  **Backend Config**: `/opt/alimed/api/appsettings.Production.json`
    *   Generowany automatycznie podczas deploymentu z sekretów.
2.  **Nginx Config**: `/etc/nginx/conf.d/alimed.conf`
    *   Zarządzany ręcznie przez administratora. Definiuje proxy pass do API (port 5056) oraz serwowanie plików Reacta.
