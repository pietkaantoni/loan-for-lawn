# Opis aplikacji - Loan for Lawn

## Przegląd

Loan for Lawn to nowoczesna aplikacja webowa do zarządzania pożyczkami online.
Aplikacja umożliwia użytkownikom rejestrację, logowanie, zaciąganie pożyczek
z oprocentowaniem, przeglądanie historii pożyczek oraz sprawdzanie aktualnych
kursów walut względem PLN.

## Funkcjonalności

### 1. System autoryzacji
- Rejestracja nowego użytkownika (nazwa użytkownika, email, hasło)
- Logowanie do istniejącego konta
- Autoryzacja JWT (JSON Web Token)
- Chronione trasy wymagające zalogowania
- Dane początkowe (fixtures) z kontami testowymi (hasło: `test123`)

### 2. Zarządzanie pożyczkami
- Gotowe oferty pożyczek do wyboru – użytkownik wybiera jedną z 8 predefiniowanych opcji
- Oprocentowanie zależne od kwoty i okresu: im wyższa kwota i krótszy czas, tym wyższe oprocentowanie
- Automatyczna kalkulacja miesięcznej raty i łącznej kwoty spłaty dla każdej oferty
- Jednoklikowe zaciągnięcie pożyczki po wybraniu oferty
- Możliwość spłaty aktywnej pożyczki jednym kliknięciem z poziomu dashboardu
- Przeglądanie wszystkich pożyczek użytkownika
- Podgląd statusu pożyczki (aktywna/spłacona)
- Walidacja danych wejściowych przez Zod

### 3. Kursy walut
- Integracja z API Narodowego Banku Polskiego (NBP)
- Wyświetlanie aktualnych kursów średnich walut względem PLN
- Możliwość wyboru interesujących walut przez kliknięcie
- Podział na waluty popularne i pozostałe
- Backend proxy chroniące klucz API NBP

### 4. Formularz kontaktowy
- Wysyłanie wiadomości przez formularz na stronie Kontakt
- Walidacja danych po stronie klienta i serwera
- Komunikacja z backendem przez API REST

### 5. Strony informacyjne
- Strona główna z hero i sekcją funkcji (responsywna)
- Podstrona "O nas" z informacjami o firmie
- Podstrona "Kontakt" z danymi kontaktowymi i formularzem

## Technologie

### Frontend
- **React 19** - biblioteka do budowania interfejsu użytkownika
- **TypeScript** - statyczne typowanie
- **Vite** - narzędzie do budowania aplikacji
- **React Router v7** - routing po stronie klienta
- **SCSS Modules** - stylowanie z zakresowe (w pełni responsywne)
- **Vitest + Testing Library** - testy jednostkowe komponentów

### Backend
- **Node.js** - środowisko uruchomieniowe
- **Express** - framework do budowania API REST
- **TypeScript** - statyczne typowanie
- **TypeORM** - ORM do obsługi bazy danych
- **PostgreSQL** - relacyjna baza danych
- **JWT (jsonwebtoken)** - autoryzacja tokenami
- **Zod** - walidacja danych wejściowych
- **bcryptjs** - hashowanie haseł

### DevOps
- **Docker** - konteneryzacja aplikacji
- **Docker Compose** - orkiestracja kontenerów (3 serwisy)
- **Nginx** - serwer produkcyjny dla frontendu + proxy API

## Architektura

Aplikacja została podzielona na dwie główne części:

1. **Frontend** - aplikacja React uruchomiana w przeglądarce,
   komunikująca się z backendem przez REST API
2. **Backend** - API REST uruchomione na serwerze Node.js,
   łączące się z bazą danych PostgreSQL

W środowisku Docker wszystko działa w osobnych kontenerach:
- `frontend` (Nginx) na porcie 5173
- `backend` (Node.js) na porcie 3001
- `db` (PostgreSQL) na porcie 5432

W trybie developerskim Vite proxy przekierowuje `/api` na `localhost:3001`.
W produkcji Nginx robi to samo na `http://backend:3001`.
