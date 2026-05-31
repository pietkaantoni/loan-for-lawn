import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = contactSchema.parse(req.body);
    console.log("Contact form submission:", { name: data.name, email: data.email, messageLength: data.message.length });
    res.json({ success: true, message: "Message received." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
      return;
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
