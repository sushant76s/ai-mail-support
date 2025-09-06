import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { encrypt } from "../services/cryptoService.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        imapUser: true,
        imapHost: true,
        imapPort: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
});

router.post("/credentials", authMiddleware, async (req, res) => {
  const { imapUser, imapPassword, imapHost, imapPort } = req.body;
  if (!imapUser || !imapPassword || !imapHost || !imapPort) {
    return res.status(400).json({ message: "All IMAP fields are required." });
  }
  try {
    const encryptedPassword = encrypt(imapPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        imapUser,
        imapPassword: encryptedPassword,
        imapHost,
        imapPort: parseInt(imapPort, 10),
      },
    });
    res.status(200).json({ message: "Credentials saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save credentials." });
  }
});

export default router;
