<div align="center">

<img src="https://www.google.com/search?q=https://cdn-icons-png.flaticon.com/512/8149/8149182.png" alt="Logo Project" width="120" height="120">

AI Web Scraper & Job Analyzer

Ekstraksi Data Cerdas, Analisis Otomatis, dan Pengujian Terintegrasi

<p align="center">
<a href="#-tentang-proyek">Tentang</a> •
<a href="#-fitur-unggulan">Fitur</a> •
<a href="#-struktur-proyek">Struktur</a> •
<a href="#-tech-stack">Teknologi</a> •
<a href="#-cara-instalasi">Instalasi</a>
</p>
</div>

📖 Tentang Proyek

AI Web Scraper adalah platform modern yang dirancang untuk melakukan scraping data web secara otomatis dan cerdas. Menggunakan teknologi Firecrawl AI untuk ekstraksi konten yang bersih dan Google Gemini AI untuk analisis data, aplikasi ini mampu mengubah website yang tidak terstruktur menjadi informasi yang berharga.

Proyek ini tidak hanya fokus pada fungsionalitas, tetapi juga pada kualitas kode dengan implementasi End-to-End Testing menggunakan Playwright yang terintegrasi langsung dengan management tool Qase.io.

🎮 Fitur Unggulan

🤖 1. Intelligent AI Scraping

Sistem pemindaian web yang tidak hanya mengambil teks, tetapi memahami struktur konten menggunakan LLM.

Logika: lib/firecrawl.ts & app/api/scrapingjob/route.ts

Cara Kerja: Mengekstrak data dari URL dan memvalidasi hasilnya menggunakan skema yang ditentukan di lib/job-validator.ts dengan dukungan Firecrawl SDK.

🔐 2. Enterprise Authentication

Keamanan tingkat tinggi untuk melindungi data hasil scraping.

Provider: Menggunakan Clerk untuk manajemen user.

Interaksi: Memisahkan akses antara pengunjung (LandingPage) dan pengguna terautentikasi (CrawlPage) melalui middleware Clerk.

📊 3. Database & Job Management

Penyimpanan data hasil scraping yang persisten dan terstruktur.

ORM: Mongoose dengan skema datajobs.model.ts.

API: Endpoint /api/jobs untuk manajemen data lowongan kerja secara real-time yang tersimpan di MongoDB.

🧪 4. Automated QA (Qase Integration)

Pengujian otomatis yang melaporkan hasil langsung ke dashboard manajemen tes (TestOps).

Testing: Playwright untuk skenario login, logout, dan pengambilan data secara otomatis.

Reporting: Integrasi playwright-qase-reporter untuk sinkronisasi hasil tes secara otomatis ke Qase.io.

📂 Struktur Proyek

Peta folder utama untuk memudahkan navigasi pengembangan:

res://
├── 📂 app/               # Next.js App Router (Pages & API Routes)
├── 📂 components/        # UI Components (Landing, Scraping, Shared)
├── 📂 lib/               # Business Logic, Database Config, & AI Tools
│   ├── 📂 database/      # Mongoose Models & Connection
│   └── 📜 firecrawl.ts   # AI Scraping Configuration
├── 📂 tests/             # Playwright E2E Test Scripts
├── 📜 next.config.ts     # Konfigurasi Next.js
└── 📜 playwright.config.ts # Konfigurasi Testing & Qase Reporter


🛠️ Tech Stack

Aplikasi ini dibangun menggunakan ekosistem teknologi terbaru untuk performa maksimal:

Core: Next.js 16/19, React 19, TypeScript.

Styling: Tailwind CSS 4, Framer Motion, GSAP.

AI & SDK: Google Generative AI (@ai-sdk/google), Firecrawl JS.

Backend: MongoDB (Mongoose), Clerk Auth.

QA: Playwright, Qase TestOps.

⚙️ Cara Instalasi

1. Clone & Install

git clone [https://github.com/username/project.git](https://github.com/username/project.git)
cd project
npm install


2. Konfigurasi Environment

Buat file .env.local dan lengkapi variabel berikut:

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI & Scraping
FIRECRAWL_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Database
MONGODB_URI=

# Testing (Qase.io)
QASE_TESTOPS_API_TOKEN=
QASE_TESTOPS_PROJECT=

# CLERK ACCOUNT
USERNAME_LOGIN=
PASSWORD_LOGIN=


3. Menjalankan Aplikasi

# Development mode
npm run dev

# Menjalankan pengujian
npx playwright test


<div align="center">
<p>Dibuat dengan dedikasi untuk efisiensi data.</p>
</div>