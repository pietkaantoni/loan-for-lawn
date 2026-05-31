import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User.js";
import { Loan } from "./models/Loan.js";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL ?? "postgresql://loanuser:loanpass@localhost:5432/loanforlawn",
  synchronize: !isProduction,
  logging: !isProduction,
  entities: [User, Loan],
});

export async function initializeDatabase(): Promise<DataSource> {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
    return AppDataSource;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
