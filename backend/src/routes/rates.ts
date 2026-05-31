import { Router } from "express";
import { getAvailableCurrencies, getRates } from "../controllers/ratesController.js";

const router = Router();

router.get("/available", getAvailableCurrencies);
router.get("/", getRates);

export default router;
