<div align="center">

# AI Web Scraper & Job Analyzer

**Ekstraksi Data Cerdas, Analisis Otomatis, dan Pengujian Terintegrasi**

![Next.js](https://img.shields.io/badge/Next.js-16%2F19-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green?style=for-the-badge&logo=playwright)


</div>

---

## 📖 Tentang Proyek

**AI Web Scraper & Job Analyzer** adalah platform modern berbasis **Next.js** yang dirancang untuk melakukan **web scraping otomatis menggunakan AI** dan **analisis data terstruktur**.  
Aplikasi ini mampu mengubah website yang tidak terstruktur menjadi informasi bernilai tinggi secara efisien dan scalable.

Proyek ini memanfaatkan **Firecrawl AI** untuk ekstraksi konten bersih serta **Google Gemini AI** untuk analisis data. Selain fokus pada fitur utama, proyek ini juga menekankan **kualitas kode dan keandalan sistem** melalui **End-to-End Testing (E2E)** menggunakan **Playwright** yang terintegrasi langsung dengan **Qase TestOps**.

---

## 🎮 Fitur Unggulan

### 🤖 1. Intelligent AI Scraping
Sistem scraping cerdas yang tidak hanya mengambil teks mentah, tetapi juga **memahami struktur dan konteks konten website** menggunakan Large Language Model (LLM).

- **Core Logic**: `lib/firecrawl.ts`, `app/api/scrapingjob/route.ts`
- **Cara Kerja**:  
  URL diproses oleh Firecrawl SDK → data diekstraksi → divalidasi menggunakan skema di `lib/job-validator.ts`.

---

### 🔐 2. Enterprise Authentication
Keamanan tingkat tinggi untuk melindungi data hasil scraping.

- **Auth Provider**: Clerk
- **Flow**:  
  Akses publik (Landing Page) dipisahkan dari halaman terautentikasi (Crawl Page) menggunakan middleware Clerk.
- **Benefit**:  
  Kontrol akses yang aman dan terstruktur untuk setiap pengguna.

---

### 📊 3. Database & Job Management
Penyimpanan data hasil scraping secara **persisten dan terorganisir**.

- **Database**: MongoDB
- **ORM**: Mongoose
- **Schema**: `datajobs.model.ts`
- **API**:  
  Endpoint `/api/jobs` untuk manajemen data lowongan kerja secara real-time.

---

### 🧪 4. Automated Quality Assurance (Qase Integration)
Pengujian otomatis yang terintegrasi langsung dengan Test Management System.

- **Framework**: Playwright
- **Skenario**: Login, logout, dan pengambilan data (E2E)
- **Reporting**:  
  `playwright-qase-reporter` untuk sinkronisasi hasil tes ke **Qase TestOps Dashboard**.

---

## 📂 Struktur Proyek

Struktur folder utama untuk menjaga kode tetap modular dan mudah dikembangkan:

```bash
res://
├── app/                     # Next.js App Router (Pages & API Routes)
├── components/              # UI Components (Landing, Scraping, Shared)
├── lib/                     # Business Logic, Database, & AI Tools
│   ├── database/            # Mongoose Models & DB Connection
│   └── firecrawl.ts         # AI Scraping Configuration
├── tests/                   # Playwright End-to-End Tests
├── next.config.ts           # Next.js Configuration
└── playwright.config.ts     # Playwright & Qase Reporter Configuration
---
```

## ⚙️ Cara Instalasi
# 1️⃣ Clone Repository & Install Dependency
```
git clone https://github.com/username/project.git](https://github.com/mujabaralno/scrapping_web
cd project
npm install
```
# 2️⃣ Konfigurasi Environment
```
Buat file .env.local dan isi variabel berikut:
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI & Scraping
FIRECRAWL_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Database
MONGODB_URI=

# Testing (Qase TestOps)
QASE_TESTOPS_API_TOKEN=
QASE_TESTOPS_PROJECT=

# Test Account (E2E)
USERNAME_LOGIN=
PASSWORD_LOGIN=
```

# 3️⃣ Menjalankan Aplikasi
```
# Development Mode
npm run dev
# Menjalankan Automated Test
npx playwright test
```

