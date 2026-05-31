import { Router } from "express";
import { createLoan, getLoans, getLoanById, repayLoan } from "../controllers/loanController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);
router.post("/", createLoan);
router.get("/", getLoans);
router.get("/:id", getLoanById);
router.post("/:id/repay", repayLoan);

export default router;
