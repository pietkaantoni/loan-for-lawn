# Testy - Sprawozdanie

## Użyte narzędzia

- **Vitest** - framework testowy (zarówno frontend jak i backend)
- **@testing-library/react** - testowanie komponentów React
- **@testing-library/jest-dom** - dodatkowe asercje DOM
- **jsdom** - symulacja środowiska przeglądarki
- **Zod** - walidacja schema używana w testach backendu

## Backend - Testy jednostkowe

### auth.test.ts
Testy dla middleware autoryzacji JWT:

**generateToken:**
- Generowanie tokena JWT z prawidłową strukturą (3 części oddzielone kropkami)
- Różne tokeny dla różnych identyfikatorów użytkowników

**authenticateToken:**
- Brak tokena → status 401
- Nieprawidłowy token → status 401
- Prawidłowy token → wywołanie `next()` (przepuszcza żądanie)

Testy używają `vi.fn()` do mockowania `res.status`, `res.json` i `next`,
co pozwala na weryfikację zachowania middleware bez uruchamiania serwera.

### loan.test.ts
Testy walidacji danych pożyczki z użyciem schematu Zod:

- Akceptacja prawidłowych danych (kwota 5000, oprocentowanie 5.5%, data 2026-12-31)
- Odrzucenie ujemnej kwoty (-100 PLN)
- Odrzucenie kwoty powyżej limitu (200 000 PLN > 100 000 max)
- Odrzucenie ujemnego oprocentowania (-1%)
- Odrzucenie nieprawidłowej daty ("not-a-date")
- Odrzucenie pustego obiektu (brak wymaganych pól)

Każdy test używa `safeParse` z Zod i sprawdza zarówno `result.success`,
jak i konkretne ścieżki błędów w `result.error.issues`.

## Frontend - Testy komponentów

### Header.test.tsx
Testy komponentu nagłówka (z `MemoryRouter`):
- Renderowanie linku z logo ("Loan for Lawn")
- Renderowanie wszystkich linków nawigacyjnych (O nas, Weź pożyczkę, Kursy walut, Kontakt)
- Dla niezalogowanego: wyświetlanie przycisków "Zaloguj się" i "Zarejestruj się"
- Dla zalogowanego (token w localStorage): wyświetlanie nazwy użytkownika i przycisku "Wyloguj"

### Home.test.tsx
Testy strony głównej:
- Renderowanie głównego nagłówka ("Loan for Lawn")
- Renderowanie sekcji funkcji (Dlaczego my?, Niskie oprocentowanie, Szybka decyzja, itd.)
- Renderowanie przycisków CTA ("Weź pożyczkę", "Załóż konto")

## Uruchamianie testów

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Watch mode (automatyczne ponowne uruchamianie przy zmianach)
```bash
npm run test:watch   # backend
cd frontend && npm run test:watch   # frontend
```

## Wyniki testów

Testy zostały zaprojektowane tak, aby pokryć kluczowe funkcjonalności
aplikacji:

1. **Autoryzacja** - generowanie i walidacja tokenów JWT (3 scenariusze dla `authenticateToken`)
2. **Walidacja danych** - sprawdzanie poprawności danych wejściowych (6 testów dla schema pożyczki)
3. **Komponenty React** - poprawne renderowanie w różnych stanach (7 testów dla Header + Home)
4. **Routing** - wyświetlanie odpowiednich elementów w zależności od stanu autoryzacji

## Propozycje rozszerzenia

- Testy integracyjne backendu z bazą danych (np. z SQLite in-memory)
- Testy end-to-end całej aplikacji (Cypress/Playwright)
- Testy wydajnościowe dla endpointów API
- Testy responsywności komponentów (różne rozdzielczości ekranu)
- Testy formularzy (walidacja po stronie klienta)
