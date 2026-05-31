import { Router } from "express";
import { createLoan, getLoans, getLoanById } from "../controllers/loanController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);
router.post("/", createLoan);
router.get("/", getLoans);
router.get("/:id", getLoanById);

export default router;
