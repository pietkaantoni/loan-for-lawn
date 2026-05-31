import "reflect-metadata";
import bcrypt from "bcryptjs";
import { initializeDatabase, AppDataSource } from "./database.js";

async function seed() {
  await initializeDatabase();
  const queryRunner = AppDataSource.createQueryRunner();

  const password_hash = await bcrypt.hash("test123", 10);

  try {
    await queryRunner.query(
      `INSERT INTO users (id, username, email, password_hash, created_at)
       VALUES ($1, $2, $3, $4, NOW()),
              ($5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO NOTHING;`,
      [
        "a0000000-0000-0000-0000-000000000001",
        "jan_kowalski",
        "jan@example.com",
        password_hash,
        "a0000000-0000-0000-0000-000000000002",
        "anna_nowak",
        "anna@example.com",
        password_hash,
      ]
    );

    await queryRunner.query(
      `INSERT INTO loans (id, user_id, amount, interest_rate, status, due_date, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()),
              ($7, $8, $9, $10, $11, $12, NOW()),
              ($13, $14, $15, $16, $17, $18, NOW())
       ON CONFLICT (id) DO NOTHING;`,
      [
        "b0000000-0000-0000-0000-000000000001",
        "a0000000-0000-0000-0000-000000000001",
        5000.0,
        5.5,
        "active",
        "2026-12-31",
        "b0000000-0000-0000-0000-000000000002",
        "a0000000-0000-0000-0000-000000000001",
        12000.0,
        4.2,
        "paid",
        "2026-06-30",
        "b0000000-0000-0000-0000-000000000003",
        "a0000000-0000-0000-0000-000000000002",
        3000.0,
        7.0,
        "active",
        "2026-09-15",
      ]
    );

    console.log("Seed data inserted successfully");
    console.log("Test accounts (password: test123):");
    console.log("  - jan@example.com (jan_kowalski)");
    console.log("  - anna@example.com (anna_nowak)");
  } finally {
    await queryRunner.release();
  }

  await AppDataSource.destroy();
}

seed().catch(console.error);
