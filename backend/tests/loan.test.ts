import { describe, it, expect } from "vitest";
import { z } from "zod";

const createLoanSchema = z.object({
  amount: z.number().positive().max(100000),
  interest_rate: z.number().min(0.1).max(100),
  due_date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
});

describe("Loan Validation Schema", () => {
  it("should accept a valid loan payload", () => {
    const result = createLoanSchema.safeParse({
      amount: 5000,
      interest_rate: 5.5,
      due_date: "2026-12-31",
    });
    expect(result.success).toBe(true);
  });

  it("should reject negative amount", () => {
    const result = createLoanSchema.safeParse({
      amount: -100,
      interest_rate: 5.0,
      due_date: "2026-12-31",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("amount");
    }
  });

  it("should reject amount over 100000", () => {
    const result = createLoanSchema.safeParse({
      amount: 200000,
      interest_rate: 5.0,
      due_date: "2026-12-31",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("amount");
    }
  });

  it("should reject negative interest rate", () => {
    const result = createLoanSchema.safeParse({
      amount: 5000,
      interest_rate: -1,
      due_date: "2026-12-31",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid due date", () => {
    const result = createLoanSchema.safeParse({
      amount: 5000,
      interest_rate: 5.0,
      due_date: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    const result = createLoanSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
