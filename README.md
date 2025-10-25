# 🏥 AliMed - Internetowy System Rejestracji Pacjentów

## 👨‍💻 Zespół (Grupa nr 3)

  * Grzegorz Matusewicz
  * Julia Łopata
  * Szymon Małota
  * Damian Litewka
  * Łukasz Antoniewicz
  * Aleksander Kutycki

-----

## 🎯 Opis projektu

Zespół realizuje projekt polegający na stworzeniu internetowego systemu rejestracji pacjentów z wykorzystaniem wyłącznie darmowych usług i narzędzi dostępnych w ekosystemie **Alibaba Cloud**.

System został wdrożony w środowisku testowym **Alibaba Cloud Free Tier**.

### Główne funkcjonalności

  * **Dla pacjentów:** Umożliwia zakładanie kont, umawianie wizyt, przeglądanie historii medycznej oraz zarządzanie danymi osobowymi.
  * **Dla personelu medycznego:** Umożliwia przeglądanie listy pacjentów, potwierdzanie rezerwacji i aktualizowanie terminów wizyt.

-----

## 🛠️ Architektura i Stos technologiczny

Poniższy diagram przedstawia architekturę systemu opartą o usługi Alibaba Cloud.

```mermaid
flowchart TD
    subgraph User["Użytkownicy"]
        direction LR
        Patient["Pacjent"]
        Staff["Personel Medyczny"]
    end

    subgraph AliMedApp["Aplikacja AliMed"]
        direction LR
        Frontend["Frontend (React / NestJS)"]
        Backend["Backend (NestJS / .NET WebApi)"]
    end

    subgraph AlibabaCloud [Alibaba Cloud Free Tier]
        direction LR
        ECS["ECS (Elastic Compute Service)"]
        DB[("ApsaraDB (MySQL)")]
        OSS[("OSS (Object Storage)")]
    end

    User --> Frontend
    Frontend --> Backend
    Backend -- Hostowany na --> ECS
    ECS -- Zapisuje/Odczytuje dane --> DB
    ECS -- Zapisuje/Odczytuje pliki --> OSS
```

**Kluczowe komponenty:**

  * **Backend:** NestJS lub .NET WebApi
  * **Frontend:** React i NestJS
  * **Hosting:** Alibaba Cloud ECS (Elastic Compute Service)
  * **Baza danych:** AsparaDB for MySQL (przechowywanie danych o pacjentach, wizytach, zaleceniach)
  * **Przechowywanie plików:** Alibaba Cloud OSS (Object Storage Service) (przechowywanie dokumentów)

-----

## 🚧 Aktualne zadania (To-Do)

### Implementacja tabeli "Lekarze" w ApsaraDB for MySQL

Obecnym priorytetem jest zaprojektowanie i wdrożenie nowej tabeli w bazie danych, która będzie przechowywać szczegółowe informacje o lekarzach przyjmujących w placówce.

**Planowana struktura tabeli:**

| Nazwa kolumny | Typ danych | Opis |
| :--- | :--- | :--- |
| `imie` | `string` | Imię lekarza. |
| `nazwisko` | `string` | Nazwisko lekarza. |
| `adres_gabinetu` | `string` | Lokalizacja świadczenia usług. |
| `numer_PWZ lub PESEL` | `string/varchar` | Do wewnętrznej identyfikacji lekarza w systemie (z uwzględnieniem RODO). |
| `opis_specjalizacji` | `text` | Opis specjalizacji lub głównych obszarów praktyki (np. "Kardiolog, leczenie nadciśnienia", "Ortopeda, specjalista urazów sportowych"). |