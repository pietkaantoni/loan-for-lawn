import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AppDataSource } from "../database.js";
import { User } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);
    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });

    if (existing) {
      res.status(409).json({ error: "User with this email or username already exists." });
      return;
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const user = userRepo.create({
      username: data.username,
      email: data.email,
      password_hash,
    });
    await userRepo.save(user);

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
      return;
    }
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const data = loginSchema.parse(req.body);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
      return;
    }
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      select: ["id", "username", "email", "created_at"],
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ user });
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}
