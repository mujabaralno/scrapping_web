<div align="center">

# 🤖 AI Web Scraper & Job Analyzer

### Intelligent Web Scraping with AI-Powered Data Extraction

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

_Transform unstructured web data into valuable, analysis-ready datasets using AI_

[Demo](#-demo) • [Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [API Reference](#-api-reference) • [Testing](#-testing)

</div>

---

## 📖 Overview

**AI Web Scraper & Job Analyzer** is a modern full-stack application built with **Next.js 16** that leverages AI to scrape, clean, and structure job listing data from any website. The platform transforms raw HTML into clean, normalized datasets ready for data mining and analysis.

### Key Capabilities

| Feature              | Technology              | Description                                               |
| -------------------- | ----------------------- | --------------------------------------------------------- |
| **AI Scraping**      | Firecrawl               | Extracts clean markdown from complex websites             |
| **Data Structuring** | Google Gemini 2.5 Flash | Intelligently parses and normalizes extracted data        |
| **Authentication**   | Clerk                   | Enterprise-grade user authentication & session management |
| **Storage**          | MongoDB + Mongoose      | Persistent storage with schema validation                 |
| **Testing**          | Playwright + Qase       | End-to-end testing with test management integration       |

---

## ✨ Features

### 🔍 Intelligent Web Scraping

Extract job listings from any website using **Firecrawl AI**. The system handles JavaScript-rendered content, dynamic loading, and complex page structures automatically.

```mermaid
flowchart LR
    A[URL Input] --> B[Firecrawl]
    B --> C[Raw Markdown]
    C --> D[Gemini AI]
    D --> E[Structured JSON]
    E --> F[MongoDB]
```

### 🧠 AI-Powered Data Cleaning

**Google Gemini 2.5 Flash** processes raw markdown and:

- Extracts job title, company, location, and requirements
- Normalizes tech stack names (e.g., "ReactJS" → "React")
- Filters soft skills, keeping only technical skills
- Removes generic terms like "Developer" or "Engineer"

### 🔐 Secure Authentication

**Clerk** provides:

- Social login (Google, GitHub, etc.)
- Email/password authentication
- Protected routes and API endpoints
- User session management

### 📊 Job Management Dashboard

Full CRUD operations with:

- Real-time data table with pagination
- Inline editing and deletion
- **CSV export** for data analysis
- Activity logging console

### 🧪 Automated Testing

**Playwright** E2E tests with **Qase TestOps** integration:

- Login/logout flow testing
- Data scraping validation
- Automatic test result sync to Qase dashboard

---

## 🏗️ Architecture

```
web_scraping/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth-protected routes
│   ├── api/
│   │   ├── jobs/                 # CRUD endpoints for jobs
│   │   └── scrapingjob/          # AI scraping endpoint
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Landing page
├── components/
│   ├── LandingPage.tsx           # Public landing page
│   ├── ScrapingPage.tsx          # Main dashboard component
│   ├── section/                  # Page sections
│   ├── ui/                       # Reusable UI components
│   └── provider/                 # Context providers
├── lib/
│   ├── database/
│   │   ├── index.ts              # MongoDB connection
│   │   └── models/               # Mongoose schemas
│   ├── firecrawl.ts              # Firecrawl client config
│   └── job-validator.ts          # Data validation utilities
├── tests/
│   ├── auth/                     # Authentication tests
│   └── data/                     # Data flow tests
├── playwright.config.ts          # Playwright + Qase config
└── package.json
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** (local or Atlas)
- API keys for Clerk, Firecrawl, and Google AI

### 1. Clone & Install

```bash
git clone https://github.com/mujabaralno/scrapping_web.git
cd scrapping_web
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# ========================================
# 🔐 Authentication (Clerk)
# ========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ========================================
# 🤖 AI Services
# ========================================
FIRECRAWL_API_KEY=fc-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# ========================================
# 🗄️ Database
# ========================================
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/

# ========================================
# 🧪 Testing (Optional - Qase Integration)
# ========================================
QASE_TESTOPS_API_TOKEN=...
QASE_TESTOPS_PROJECT=...

# Test Accounts for E2E
USERNAME_LOGIN=test@example.com
PASSWORD_LOGIN=testpassword123
```

### 3. Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

---

## 📡 API Reference

### `POST /api/scrapingjob`

Scrape job listings from a URL using AI.

**Request:**

```json
{
  "url": "https://example.com/jobs"
}
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "job_title": "Software Engineer",
      "company": "Tech Corp",
      "location": "Jakarta, Indonesia",
      "requirements_text": "5+ years experience...",
      "label_skill": "React, Node.js, PostgreSQL"
    }
  ]
}
```

---

### `GET /api/jobs`

Retrieve all scraped jobs.

**Response:**

```json
{
  "jobs": [
    {
      "_id": "...",
      "job_title": "...",
      "company": "...",
      "location": "...",
      "requirements_text": "...",
      "label_skill": "..."
    }
  ]
}
```

---

### `PATCH /api/jobs`

Update a job entry.

**Request:**

```json
{
  "id": "mongodb_object_id",
  "job_title": "Updated Title",
  "company": "Updated Company",
  "label_skill": "Python, Django"
}
```

---

### `DELETE /api/jobs`

Delete a job entry.

**Request:**

```json
{
  "id": "mongodb_object_id"
}
```

---

## 🧪 Testing

### Run E2E Tests

```bash
# Run all tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/auth/login.spec.ts
```

### Test Reports

- **HTML Report:** `playwright-report/index.html`
- **Qase Dashboard:** Results sync automatically when `QASE_TESTOPS_API_TOKEN` is configured

---

## 🛠️ Tech Stack

| Category          | Technologies                               |
| ----------------- | ------------------------------------------ |
| **Framework**     | Next.js 16, React 19, TypeScript 5         |
| **Styling**       | Tailwind CSS 4, Framer Motion, GSAP        |
| **AI/ML**         | Firecrawl, Google Gemini AI, Vercel AI SDK |
| **Database**      | MongoDB 7, Mongoose 9                      |
| **Auth**          | Clerk                                      |
| **Testing**       | Playwright, Qase TestOps                   |
| **UI Components** | Radix UI, Lucide Icons, Sonner             |
| **Validation**    | Zod 4                                      |

---

## 📄 License

This project is part of a thesis/final project (Tugas Akhir).

---

<div align="center">

**Built with ❤️ using Next.js and AI**

[⬆ Back to Top](#-ai-web-scraper--job-analyzer)

</div>
