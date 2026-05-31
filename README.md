# Loan for Lawn

Aplikacja webowa do zarządzania pożyczkami online. Umożliwia rejestrację,
logowanie, zaciąganie pożyczek z oprocentowaniem, przeglądanie historii
pożyczek oraz sprawdzanie aktualnych kursów walut względem PLN.

## Technologie

- **Frontend:** React 19, TypeScript, Vite, SCSS Modules, React Router, Vitest
- **Backend:** Node.js, Express, TypeScript, TypeORM, PostgreSQL, Zod, JWT
- **DevOps:** Docker, Docker Compose, Nginx

## Wymagania

- Node.js 24+
- Docker i Docker Compose (lub PostgreSQL uruchomiony lokalnie)
- npm

## Szybki start (Docker)

```bash
# Sklonuj repozytorium
git clone https://github.com/twoja-nazwa/loan-for-lawn.git
cd loan-for-lawn

# Uruchom wszystkie serwisy
docker compose up --build
```

Aplikacja będzie dostępna pod adresem:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Uruchomienie bez Dockera

### 1. Backend

```bash
cd backend
cp .env.example .env    # skonfiguruj zmienne środowiskowe
npm install
npm run dev
```

Backend uruchomi się na http://localhost:3001.

**Uwaga:** Backend wymaga PostgreSQL. Skonfiguruj zmienne w `backend/.env`:

- `DATABASE_URL` - np. `postgresql://loanuser:loanpass@localhost:5432/loanforlawn`
- `JWT_SECRET` - sekret do podpisywania tokenów
- `CORS_ORIGINS` - dozwolone originy (oddzielone przecinkami)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend uruchomi się na http://localhost:5173 i automatycznie
przekieruje zapytania `/api` do backendu (Vite proxy).

### 3. Inicjalizacja bazy danych

Po pierwszym uruchomieniu backendu tabele zostaną utworzone automatycznie
przez TypeORM (opcja `synchronize: true` działa tylko w trybie developerskim).

Aby dodać przykładowe dane (fixtures):

```bash
cd backend
npm run seed
```

Po seedzie dostępne są konta testowe (hasło: `test123`):
- `jan@example.com` (użytkownik: `jan_kowalski`)
- `anna@example.com` (użytkownik: `anna_nowak`)

## Testy

### Backend
```bash
cd backend
npm test
```

Testy obejmują: walidację JWT (generowanie i weryfikacja tokenów),
walidację schema pożyczek (Zod).

### Frontend
```bash
cd frontend
npm test
```

Testy obejmują: renderowanie komponentów Header i Home w różnych stanach.

## Struktura projektu

```
loan-for-lawn/
├── backend/              # API REST (Express + TypeScript + TypeORM)
│   ├── src/
│   │   ├── controllers/  # Logika biznesowa
│   │   ├── middleware/    # Autoryzacja JWT
│   │   ├── models/       # Encje TypeORM
│   │   ├── routes/       # Definicje tras
│   │   ├── database.ts   # Konfiguracja bazy
│   │   ├── index.ts      # Punkt wejścia
│   │   └── seed.ts       # Dane początkowe
│   ├── tests/            # Testy backendu
│   └── .env.example      # Wzór konfiguracji
├── frontend/             # Aplikacja kliencka (React + Vite)
│   ├── src/
│   │   ├── components/   # Header, Footer, ProtectedRoute
│   │   ├── pages/        # Home, Login, Register, Dashboard, Loan, Rates, About, Contact
│   │   ├── services/     # Komunikacja z API
│   │   └── types/        # Typy TypeScript
│   └── tests/            # Testy frontendu
├── docs/                 # Dokumentacja projektu
├── compose.yaml          # Konfiguracja Docker Compose
└── README.md
```

## API Endpointy

### Autoryzacja
| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/auth/register` | Rejestracja |
| POST | `/api/auth/login` | Logowanie |
| GET | `/api/auth/me` | Profil (wymaga tokena) |

### Pożyczki (wymagają tokena)
| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/loans` | Lista pożyczek |
| POST | `/api/loans` | Nowa pożyczka |
| GET | `/api/loans/:id` | Szczegóły pożyczki |

### Kursy walut
| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/rates` | Kursy walut (`?currencies=EUR,USD`) |
| GET | `/api/rates/available` | Lista dostępnych walut |

### Kontakt
| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/api/contact` | Formularz kontaktowy |

### Status
| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/api/health` | Status serwera |

## Dokumentacja

Szczegółowa dokumentacja znajduje się w katalogu `docs/`:
- [Opis aplikacji](docs/opis-aplikacji.md)
- [Podział pracy](docs/podzial-pracy.md)
- [Baza danych](docs/baza-danych.md)
- [Testy](docs/testy.md)

## Uwagi

- Aplikacja wykorzystuje darmowe API NBP (Narodowy Bank Polski) do pobierania kursów walut
- Hasła są przechowywane w formie zahashowanej (bcrypt)
- Autoryzacja odbywa się za pomocą tokenów JWT
- `synchronize: true` w TypeORM działa TYLKO w trybie developerskim (nie w produkcji)
- W środowisku produkcyjnym zmień `JWT_SECRET` na silny, losowy ciąg znaków
- Zmienne `CORS_ORIGINS` i `JWT_SECRET` można konfigurować przez zmienne środowiskowe
