---
# AI Mail Support Assistant

An intelligent, AI-powered communication assistant designed to streamline customer support operations. This tool automatically fetches, categorizes, prioritizes, and generates context-aware draft responses for support emails, significantly reducing manual workload and improving response times.

![Dashboard](https://img.shields.io/badge/Dashboard-React_MUI-informational) ![Backend](https://img.shields.io/badge/Backend-Node.js_Express-success) ![AI](https://img.shields.io/badge/AI-Google_Gemini-blueviolet) ![Database](https://img.shields.io/badge/Database-PostgreSQL_Prisma-ff69b4)
---
## Demo
Watch the demo video here: [YouTube Link](https://youtu.be/oLf5fvMx5QU?si=LYU2TM-7s7t2QBM8)
## Architecture & Approach
Documentation: [Google Document](https://docs.google.com/document/d/1QpXLOwnWJX2g2P5WIMZiwsDxTczDGGLt1Y5RN-H3Xpg/edit?usp=sharing)

## Features

### Core Functionality

- **Automated Email Retrieval**: Fetches incoming emails from a Gmail account via IMAP, filtering for support-related keywords (`support`, `query`, `request`, `help`).
- **AI-Powered Analysis**: Utilizes Google's Gemini AI to perform:
  - **Sentiment Analysis**: Classifies emails as Positive, Negative, or Neutral.
  - **Priority Scoring**: Flags emails as `URGENT` or `NOT_URGENT` based on keywords and sentiment.
  - **Information Extraction**: Parses key details like contact info, order IDs, and specific requests into a structured JSON format.
  - **Context-Aware Draft Generation**: Creates professional, empathetic, and knowledgeable draft responses using a built-in knowledge base (RAG).
- **Prioritized Processing**: Implements a priority queue, ensuring urgent emails are processed and displayed first.

### Dashboard & User Interface

- **Unified Dashboard**: A clean, modern UI built with React and Material-UI.
- **Email Inbox**: Lists all processed emails with sender, subject, sentiment, and priority status.
- **Detailed Email View**: Click any email to see its full content, extracted information, and the AI-generated draft response.
- **Interactive Analytics**: Displays key metrics and charts, including:
  - Total, pending, and resolved email counts.
  - Emails received in the last 24 hours.
  - Breakdown of emails by sentiment and priority.
- **Search Functionality**: Quickly find emails by sender, subject, or body content.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Email Protocol**: IMAP (using `imap-simple` and `mailparser`)
- **AI/LLM**: Google Gemini AI API

### Frontend

- **Library**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Charts**: Recharts

## Project Structure

```
ai-mail-support/
├── client/                 # React TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Dashboard, Stats, EmailList, etc.)
│   │   ├── api.ts         # Axios configuration
│   │   ├── theme.ts       # MUI theme customization
│   │   └── types.ts       # TypeScript type definitions
│   ├── package.json
│   └── ...
├── server/                 # Node.js Express Backend
│   ├── services/
│   │   ├── emailService.js # IMAP fetching and processing logic
│   │   └── aiService.js    # Gemini AI integration & prompt engineering
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── index.js           # Express server setup and API routes
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- A **Gmail account** (with Less Secure App Access enabled or an App Password)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-mail-support
```

### 2. Backend Setup

1.  **Navigate to the server directory:**

    ```bash
    cd server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `server/` directory and configure the following variables:

    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/ai_mail_support"
    GEMINI_API_KEY="your_google_gemini_api_key_here"
    IMAP_USER="your_email@gmail.com"
    IMAP_PASSWORD="your_gmail_app_password"
    PORT=3001
    ```

    _How to get a Gmail App Password: [Gmail App Passwords](https://support.google.com/accounts/answer/185833)_

4.  **Set up the Database:**
    Run Prisma migrations to create the tables in your PostgreSQL database.

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3001`. It will automatically begin fetching and processing emails every 10 minutes.

### 3. Frontend Setup

1.  **Open a new terminal and navigate to the client directory:**

    ```bash
    cd ../client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the React development server:**
    ```bash
    npm start
    ```
    The client will start on `http://localhost:3000` and should automatically connect to the backend.

## How to Use

1.  **View the Dashboard:** Open your browser to `http://localhost:3000`. The dashboard will load with statistics and your inbox.
2.  **Wait for Emails:** The server checks for new emails every 10 minutes. Send a test email to your configured Gmail address with a subject containing "Support", "Help", etc.
3.  **Analyze Results:** New emails will appear in the inbox list, categorized by sentiment and priority. Urgent emails will appear at the top.
4.  **View Details & Drafts:** Click on any email to open a detailed view. Here you can see the original email, the extracted information, and the AI-generated draft response.
5.  **Copy Drafts:** Use the copy icon next to the draft response to copy it to your clipboard for use in your email client.

## API Endpoints

| Endpoint      | Method | Description                                                                            |
| :------------ | :----- | :------------------------------------------------------------------------------------- |
| `/api/emails` | GET    | Fetches all processed emails, sorted by priority (urgent first) and date.              |
| `/api/stats`  | GET    | Returns dashboard statistics (total counts, sentiment/priority breakdown, 24h volume). |

## Database Schema (Prisma)

The application uses a PostgreSQL database with a single `Email` model storing all processed data.

```prisma
model Email {
  id            String   @id @default(cuid())
  messageId     String   @unique
  sender        String
  subject       String
  body          String
  receivedAt    DateTime
  sentiment     Sentiment
  priority      Priority
  extractedInfo Json?    // Stores names, phone numbers, etc.
  draftResponse String?
  status        Status
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## AI & Prompt Engineering

The core intelligence is in `server/services/aiService.js`. It uses a carefully engineered prompt to instruct the Gemini model to:

1.  Analyze sentiment and priority based on defined rules.
2.  Extract structured information from unstructured text.
3.  Generate a empathetic and professional draft response by grounding its knowledge in the provided `knowledgeBase` string (a simple RAG implementation).

## Potential Improvements & Future Work

- **Email Sending:** Integrate with SMTP or the Gmail API to send responses directly from the dashboard.
- **Response Editing & Approval:** Allow users to edit and approve drafts before sending.
- **Knowledge Base Management:** Create a UI to manage the knowledge base content dynamically.
- **Real-time Updates:** Implement WebSockets for real-time email notifications instead of polling.
- **Multiple Email Providers:** Add support for Outlook, Yahoo, and other providers via their APIs.
- **User Authentication:** Add login/logout functionality to support multiple agents.
- **Advanced Analytics:** Add more detailed charts and time-series analysis for support performance.

## License

This project was created as part of a hackathon.

---
