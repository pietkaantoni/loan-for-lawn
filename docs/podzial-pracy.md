# Podział pracy

## Struktura projektu

```
loan-for-lawn/
├── backend/                    # Backend - API REST
│   ├── src/
│   │   ├── controllers/        # Kontrolery (logika biznesowa)
│   │   │   ├── authController.ts
│   │   │   ├── loanController.ts
│   │   │   └── ratesController.ts
│   │   ├── middleware/         # Middleware (autoryzacja JWT)
│   │   │   └── auth.ts
│   │   ├── models/             # Modele danych (TypeORM)
│   │   │   ├── User.ts
│   │   │   └── Loan.ts
│   │   ├── routes/             # Definicje tras API
│   │   │   ├── auth.ts
│   │   │   ├── loans.ts
│   │   │   ├── rates.ts
│   │   │   └── contact.ts
│   │   ├── database.ts         # Konfiguracja bazy danych
│   │   ├── index.ts            # Punkt wejścia serwera
│   │   └── seed.ts             # Dane początkowe (fixtures)
│   ├── tests/                  # Testy backendu
│   ├── .env.example            # Wzór konfiguracji środowiskowej
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Frontend - aplikacja React
│   ├── src/
│   │   ├── components/         # Komponenty wielokrotnego użytku
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── ProtectedRoute/
│   │   ├── pages/              # Strony aplikacji
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Loan/
│   │   │   ├── Rates/
│   │   │   ├── About/
│   │   │   └── Contact/
│   │   ├── services/           # Komunikacja z API
│   │   ├── types/              # Typy TypeScript
│   │   ├── App.tsx             # Główny komponent z routingiem
│   │   └── main.tsx            # Punkt wejścia
│   ├── tests/                  # Testy frontendu
│   ├── nginx.conf              # Konfiguracja Nginx
│   ├── Dockerfile
│   └── package.json
├── docs/                       # Dokumentacja projektu
│   ├── opis-aplikacji.md
│   ├── podzial-pracy.md
│   ├── baza-danych.md
│   └── testy.md
├── compose.yaml                # Konfiguracja Docker Compose
└── README.md                   # Główny plik README
```

## Podział na komponenty

### Backend (Express + TypeScript + TypeORM)

| Komponent | Opis |
|-----------|------|
| `authController` | Rejestracja, logowanie, pobieranie profilu |
| `loanController` | Tworzenie, wyświetlanie i spłacanie pożyczek |
| `ratesController` | Integracja z API NBP, lista walut, kursy |
| `auth middleware` | Weryfikacja tokenów JWT (`generateToken`, `authenticateToken`) |
| `User model` | Encja użytkownika w bazie danych |
| `Loan model` | Encja pożyczki w bazie danych |

### Frontend (React + TypeScript + SCSS)

| Komponent | Opis |
|-----------|------|
| `Header` | Nawigacja, logo, przyciski logowania/wylogowania |
| `Footer` | Stopka z informacjami i disclaimerem |
| `ProtectedRoute` | Ochrona tras wymagających autoryzacji |
| `Home` | Strona główna z hero i sekcją funkcji |
| `Login` | Formularz logowania z walidacją |
| `Register` | Formularz rejestracji z walidacją |
| `Dashboard` | Panel użytkownika z listą i statystykami pożyczek |
| `LoanPage` | Wybór predefiniowanej oferty pożyczki z kalkulacją raty i kosztu całkowitego |
| `Rates` | Przeglądarka kursów walut z wyborem walut |
| `About` | Strona informacyjna o firmie |
| `Contact` | Strona kontaktowa z danymi i formularzem |

## API Endpointy

### Autoryzacja
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Profil użytkownika (wymaga tokena)

### Pożyczki (wymagają tokena)
- `GET /api/loans` - Lista pożyczek użytkownika
- `POST /api/loans` - Utworzenie nowej pożyczki (predefiniowane oferty)
- `GET /api/loans/:id` - Szczegóły pożyczki
- `POST /api/loans/:id/repay` - Spłata aktywnej pożyczki

### Kursy walut (publiczne)
- `GET /api/rates` - Kursy walut (opcjonalny filtr `?currencies=EUR,USD`)
- `GET /api/rates/available` - Lista dostępnych walut (popularne + pozostałe)

### Kontakt (publiczne)
- `POST /api/contact` - Wysłanie wiadomości przez formularz

### Status
- `GET /api/health` - Sprawdzenie statusu serwera

## Zmienne środowiskowe (backend)

| Zmienna | Domyślnie | Opis |
|---------|-----------|------|
| `PORT` | `3001` | Port serwera |
| `JWT_SECRET` | (wymagany) | Sekret do podpisywania tokenów JWT |
| `JWT_EXPIRES_IN` | `7d` | Czas ważności tokena |
| `DATABASE_URL` | `postgresql://loanuser:loanpass@localhost:5432/loanforlawn` | URL do bazy PostgreSQL |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:4173` | Dozwolone originy CORS (oddzielone przecinkami) |
| `NODE_ENV` | `development` | Tryb pracy (w produkcji `synchronize` jest wyłączone) |
