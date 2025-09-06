import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { fetchAndProcessEmails } from "./services/emailService.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---

// Get all processed emails, urgent ones first
app.get("/api/emails", async (req, res) => {
  try {
    const emails = await prisma.email.findMany({
      where: { status: "PROCESSED" },
      orderBy: [
        { priority: "desc" }, // 'URGENT' comes before 'NOT_URGENT'
        { receivedAt: "desc" },
      ],
    });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// Get dashboard statistics
app.get("/api/stats", async (req, res) => {
  try {
    const total = await prisma.email.count();
    const pending = await prisma.email.count({ where: { status: "PENDING" } });
    const resolved = await prisma.email.count({
      where: { status: "RESOLVED" },
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24Hours = await prisma.email.count({
      where: { receivedAt: { gte: twentyFourHoursAgo } },
    });

    const sentimentCounts = await prisma.email.groupBy({
      by: ["sentiment"],
      _count: { sentiment: true },
    });

    const priorityCounts = await prisma.email.groupBy({
      by: ["priority"],
      _count: { priority: true },
    });

    res.json({
      total,
      pending,
      resolved,
      last24Hours,
      sentimentCounts,
      priorityCounts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Periodically fetch emails every 60 seconds
  setInterval(fetchAndProcessEmails, 600000);

  // Initial fetch on startup
  fetchAndProcessEmails();
});
