# Baza danych - Opis i diagram

## Wybór bazy danych

Do przechowywania danych wykorzystano **PostgreSQL** - relacyjną bazę danych.
Wybór PostgreSQL podyktowany jest:
- Silnym wsparciem dla relacji między danymi (użytkownik <-> pożyczki)
- Transakcyjnością i integralnością danych
- Wsparciem dla zaawansowanych typów danych (UUID, DECIMAL)
- Łatwą integracją z TypeORM

## Konfiguracja

Połączenie z bazą konfiguruje się przez zmienną środowiskową `DATABASE_URL`:

```
DATABASE_URL=postgresql://loanuser:loanpass@localhost:5432/loanforlawn
```

TypeORM jest skonfigurowany z opcją `synchronize: true` **TYLKO w trybie
developerskim**. W produkcji (`NODE_ENV=production`) synchronizacja schematu
jest wyłączona, aby zapobiec przypadkowej utracie danych. Migracje należy
wykonywać ręcznie.

## Schemat bazy danych

### Tabela: users

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| id | UUID | PK, auto-generowany | Unikalny identyfikator użytkownika |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Nazwa użytkownika |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Adres email |
| password_hash | VARCHAR(255) | NOT NULL | Hash hasła (bcrypt, 10 rund) |
| created_at | TIMESTAMP | NOT NULL, domyślnie NOW() | Data utworzenia konta |

### Tabela: loans

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|-------------|------|
| id | UUID | PK, auto-generowany | Unikalny identyfikator pożyczki |
| user_id | UUID | FK -> users.id, NOT NULL | Identyfikator użytkownika |
| amount | DECIMAL(12,2) | NOT NULL | Kwota pożyczki (max 100000) |
| interest_rate | DECIMAL(5,2) | NOT NULL | Oprocentowanie roczne w % |
| status | VARCHAR(20) | NOT NULL, domyślnie 'active' | Status: 'active' lub 'paid' |
| due_date | DATE | NOT NULL | Data spłaty |
| created_at | TIMESTAMP | NOT NULL, domyślnie NOW() | Data utworzenia pożyczki |

## Diagram relacyjny

```
┌──────────────────┐          ┌──────────────────┐
│      users       │          │      loans       │
├──────────────────┤          ├──────────────────┤
│ id (UUID) ───────┼──┐       │ id (UUID)        │
│ username         │  │       │ user_id (FK) ────┼──┘
│ email            │  └───────│ amount            │
│ password_hash    │    1:N   │ interest_rate     │
│ created_at       │          │ status            │
└──────────────────┘          │ due_date          │
                              │ created_at        │
                              └──────────────────┘
```

Relacja: **Jeden użytkownik może mieć wiele pożyczek** (1:N).
Klucz obcy `user_id` z opcją `ON DELETE CASCADE` - usunięcie użytkownika
usuwa wszystkie jego pożyczki.

## TypeORM Entities

### User Entity
```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];
}
```

### Loan Entity
```typescript
@Entity("loans")
export class Loan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column("decimal", { precision: 12, scale: 2 })
  amount: number;

  @Column("decimal", { precision: 5, scale: 2 })
  interest_rate: number;

  @Column({ type: "varchar", length: 20, default: "active" })
  status: LoanStatus;

  @Column({ type: "date" })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.loans, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
```

## Dane początkowe (Fixtures)

Aplikacja zawiera skrypt `seed.ts` który dodaje przykładowych użytkowników
i pożyczki do bazy danych.

**Uruchomienie:**
```bash
cd backend
npm run seed
```

**Konta testowe (wszystkie z hasłem `test123`):**
| Email | Użytkownik | Opis |
|-------|-----------|------|
| `jan@example.com` | `jan_kowalski` | Ma 2 pożyczki (1 aktywna, 1 spłacona) |
| `anna@example.com` | `anna_nowak` | Ma 1 aktywną pożyczkę |

Skrypt używa `bcrypt.hash()` do wygenerowania prawidłowych hash haseł,
więc konta testowe są w pełni funkcjonalne.

## Operacje na pożyczkach

### Spłata pożyczki
Użytkownik może spłacić aktywną pożyczkę poprzez endpoint `PATCH /api/loans/:id/repay`.
Po udanej spłacie status pożyczki zmienia się z `'active'` na `'paid'`.
Spłacić można tylko pożyczkę o statusie `'active'` należącą do zalogowanego użytkownika.
