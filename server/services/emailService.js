import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import { PrismaClient } from "@prisma/client";
import { processEmailWithAI } from "./aiService.js";
import { decrypt } from "./cryptoService.js";

const prisma = new PrismaClient();

export async function fetchEmailsForUser(user) {
  const imapPassword = decrypt(user.imapPassword); // Decrypt the user's stored password

  if (!user.imapUser || !imapPassword || !user.imapHost || !user.imapPort) {
    console.log(
      `Skipping email fetch for ${user.email}: IMAP credentials not configured.`
    );
    return;
  }

  const imapConfig = {
    imap: {
      user: user.imapUser,
      password: imapPassword,
      host: user.imapHost,
      port: user.imapPort,
      tls: true,
      authTimeout: 5000,
      tlsOptions: { rejectUnauthorized: false },
    },
  };

  let connection;
  try {
    console.log(`Connecting to IMAP for user ${user.email}...`);
    connection = await imaps.connect(imapConfig);
    await connection.openBox("INBOX");

    const keywords = ["support", "query", "request", "help"];
    const subjectQueries = keywords.map((keyword) => ["SUBJECT", keyword]);
    const combinedOrQuery = subjectQueries.reduce((prev, curr) => [
      "OR",
      prev,
      curr,
    ]);

    const searchCriteria = ["UNSEEN", combinedOrQuery];
    const fetchOptions = { bodies: [""], markSeen: true };
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${messages.length} matching emails for ${user.email}.`);

    for (const item of messages) {
      const rawEmail = item.parts.find((part) => part.which === "").body;
      if (!rawEmail) continue;

      const parsed = await simpleParser(rawEmail);
      const messageId = parsed.messageId;

      if (!messageId) {
        console.warn(
          `Skipping email with subject "${parsed.subject}" because it has no Message-ID.`
        );
        continue;
      }

      const existingEmail = await prisma.email.findUnique({
        where: { messageId },
      });
      if (existingEmail) {
        console.log(`Skipping duplicate email: ${parsed.subject}`);
        continue;
      }

      const emailData = {
        messageId: messageId,
        sender: parsed.from.text,
        subject: parsed.subject,
        body: parsed.text || "",
        receivedAt: parsed.date,
        userId: user.id,
      };

      const newEmail = await prisma.email.create({ data: emailData });
      console.log(`Saved new email for ${user.email}: ${newEmail.subject}`);

      const aiResult = await processEmailWithAI(newEmail);
      if (aiResult) {
        await prisma.email.update({
          where: { id: newEmail.id },
          data: {
            sentiment: aiResult.sentiment,
            priority: aiResult.priority,
            extractedInfo: aiResult.extractedInfo || {},
            draftResponse: aiResult.draftResponse,
            status: "PROCESSED",
          },
        });
        console.log(`Successfully processed email: ${newEmail.subject}`);
      }
    }
    connection.end();
  } catch (error) {
    console.error(
      `An error occurred during email fetching for ${user.email}:`,
      error
    );
    if (connection) connection.end();
  }
}

async function fetchForAllUsers() {
  console.log("Starting periodic email fetch for all users...");
  const users = await prisma.user.findMany({
    where: {
      imapPassword: { not: null }, // Only fetch for users who have provided credentials
    },
  });

  console.log(`Found ${users.length} users with configured credentials.`);
  for (const user of users) {
    await fetchEmailsForUser(user);
  }
}

// This function will be called by setInterval in the main server file
export function startEmailFetchingService() {
  setInterval(fetchForAllUsers, 600000); // Periodically fetch emails every 10 minutes (600000 ms)
  fetchForAllUsers(); // Initial fetch on startup
}
