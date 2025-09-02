import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import { PrismaClient } from "@prisma/client";
import { processEmailWithAI } from "./aiService.js";

const prisma = new PrismaClient();

const imapConfig = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

export async function fetchAndProcessEmails() {
  try {
    console.log("Connecting to IMAP server...");
    const connection = await imaps.connect(imapConfig);
    await connection.openBox("INBOX");
    console.log("Connection successful. Searching for emails...");

    const keywords = ["support", "query", "request", "help"];
    const subjectQueries = keywords.map((keyword) => ["SUBJECT", keyword]);

    if (subjectQueries.length === 0) {
      console.log("No keywords defined for email search.");
      connection.end();
      return;
    }

    const combinedOrQuery =
      subjectQueries.length > 1
        ? subjectQueries.reduce((prev, curr) => ["OR", prev, curr])
        : subjectQueries[0];

    const searchCriteria = ["UNSEEN", combinedOrQuery];

    // const fetchOptions = {
    //   bodies: ["HEADER", "TEXT"],
    //   markSeen: true,
    // };

    const fetchOptions = {
      bodies: [""], // fetch the full raw message
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${messages.length} matching emails.`);
    console.log("messages: ", messages);

    for (const item of messages) {
      //   const all = item.parts.find((part) => part.which === "TEXT");
      //   const emailContent = all.body;
      //   const parsed = await simpleParser(emailContent);

      //   console.log("Parsed: ", parsed);

      //   const messageId = parsed.messageId;

      const all = item.parts.find((part) => part.which === "");
      if (!all) continue;

      const parsed = await simpleParser(all.body);
      console.log("Parsed:", parsed);

      const messageId = parsed.messageId;

      // --- FIX STARTS HERE ---
      // Add a guard clause to ensure the email has a Message-ID.
      if (!messageId) {
        console.warn(
          `Skipping email with subject "${parsed.subject}" because it has no Message-ID.`
        );
        continue; // Skip to the next email in the loop
      }
      // --- FIX ENDS HERE ---

      // Check if email already exists (this code now only runs if messageId is valid)
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
      };

      // 1. Save initial email to DB
      const newEmail = await prisma.email.create({ data: emailData });
      console.log(`Saved new email: ${newEmail.subject}`);

      // 2. Process with AI
      const aiResult = await processEmailWithAI(newEmail);

      // 3. Update email with AI analysis
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
        console.log(
          `Successfully processed and updated email: ${newEmail.subject}`
        );
      }
    }

    connection.end();
  } catch (error) {
    console.error("An error occurred during email fetching:", error);
  }
}
