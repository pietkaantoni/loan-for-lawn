import "reflect-metadata";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database.js";
import authRoutes from "./routes/auth.js";
import loanRoutes from "./routes/loans.js";
import ratesRoutes from "./routes/rates.js";
import contactRoutes from "./routes/contact.js";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/rates", ratesRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

export default app;
