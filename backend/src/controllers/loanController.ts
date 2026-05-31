import { Response } from "express";
import { z } from "zod";
import { AppDataSource } from "../database.js";
import { Loan } from "../models/Loan.js";
import type { AuthRequest } from "../middleware/auth.js";

const createLoanSchema = z.object({
  amount: z.number().positive().max(100000),
  interest_rate: z.number().min(0.1).max(100),
  due_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
});

export async function createLoan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = createLoanSchema.parse(req.body);
    const loanRepo = AppDataSource.getRepository(Loan);

    const loan = loanRepo.create({
      user_id: req.userId!,
      amount: data.amount,
      interest_rate: data.interest_rate,
      due_date: new Date(data.due_date),
    });

    await loanRepo.save(loan);
    res.status(201).json({ loan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
      return;
    }
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getLoans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const loanRepo = AppDataSource.getRepository(Loan);
    const loans = await loanRepo.find({
      where: { user_id: req.userId! },
      order: { created_at: "DESC" },
    });
    res.json({ loans });
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getLoanById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const loanRepo = AppDataSource.getRepository(Loan);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const loan = await loanRepo.findOne({
      where: { id, user_id: req.userId! },
    });

    if (!loan) {
      res.status(404).json({ error: "Loan not found." });
      return;
    }

    res.json({ loan });
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function repayLoan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const loanRepo = AppDataSource.getRepository(Loan);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const loan = await loanRepo.findOne({
      where: { id, user_id: req.userId! },
    });

    if (!loan) {
      res.status(404).json({ error: "Loan not found." });
      return;
    }

    if (loan.status !== "active") {
      res.status(400).json({ error: "Only active loans can be repaid." });
      return;
    }

    loan.status = "paid";
    await loanRepo.save(loan);
    res.json({ loan, message: "Loan repaid successfully." });
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}
