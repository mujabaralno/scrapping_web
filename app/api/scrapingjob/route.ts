/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import DataJob from "@/lib/database/models/datajobs.model";
import FirecrawlApp from "@mendable/firecrawl-js";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// Konfigurasi API Keys
const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

const gemini = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

// Schema Validasi
const schema = z.object({
  listings: z.array(
    z.object({
      job_title: z.string(),
      company: z.string(),
      location: z.string(),
      requirements_text: z.string(),
      label_skill: z.string().optional(),
      url_lowongan: z.string().optional(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    await connectToDatabase();
    console.log("🚀 Memulai proses untuk URL:", url);

    // ------------------------------------------------------------------
    // STEP A: Firecrawl (Ambil Mentahan Markdown)
    // ------------------------------------------------------------------
    // Kita cuma minta markdown, biarkan Gemini yang pusing parsing strukturnya
    const scrapeRes = await firecrawl.scrape(url, {
      formats: ["markdown"],
      waitFor: 5000
    });

    if (!scrapeRes.markdown) {
      throw new Error("Gagal mengambil markdown dari Firecrawl");
    }

    if (scrapeRes.markdown.length < 2000) {
        console.log("⚠️ WARNING: Markdown terlalu pendek. Isi konten:", scrapeRes.markdown);
        // Jangan throw error dulu, biar kita bisa baca log-nya di terminal
    }

    console.log("🔥 Firecrawl Berhasil. Panjang Markdown:", scrapeRes.markdown.length);

    // ------------------------------------------------------------------
    // STEP B: The AI Transformation (Powered by Gemini)
    // ------------------------------------------------------------------
    const { object: cleanedData } = await generateObject({
      model: gemini("gemini-2.5-flash"),
      schema: schema,
      prompt: `
You are an expert Data Engineer and Data Cleaner.
Extract job listings from the raw markdown provided below.

Your MAIN GOAL is to produce a clean, high-quality dataset ready for "Association Rule Mining" analysis.

### INSTRUCTIONS:
1. **Scope:** Ignore navigation, footers, and general site text. Focus ONLY on job cards/listings.
2. **Truncation:** If text is cut off, capture only what is visible.

### CRITICAL RULES FOR "label_skill" (CLEANING RULES):
You must normalize and clean the skills *before* outputting them.
1. **Normalization (Canonicalization):** Standardize tech stack names.
   - "ReactJS", "React.js", "React JS" -> MUST become "React"
   - "NodeJS", "Node.js" -> MUST become "Node.js"
   - "Golang" -> MUST become "Go"
   - "Amazon Web Services", "AWS Cloud" -> MUST become "AWS"
2. **Hard Skills Only:** Extract only TECHNICAL skills (Languages, Frameworks, Databases, Tools).
   - IGNORE soft skills like "Communication", "Leadership", "Teamwork".
3. **Exclusion List (Blacklist):** DO NOT include job title words or generic terms as skills.
   - REMOVE: "Engineer", "Developer", "Senior", "Junior", "Full Stack", "Backend", "Frontend", "Manager", "Lead", "Consultant", "Remote", "Hybrid", "On-site".
  - DONT USE ARRAY SIMBOL IN label_skill, dont like this "[]" 
4. SANGAT PENTING: JANGAN KOSONGKAN ATRIBUT label_skill, TOLONG BACA requirement_text dengan benar!!!!!!!!
5. Dilabel Skill jangan tulis seperti Programming, Machine Learning, dll, tulis tech stack apa saja yang dibutuhkan di requirement_text jobnyaa!!!
### RAW MARKDOWN INPUT:
${scrapeRes.markdown}
`,
    });

    // DEBUG: Cek apa yang Gemini temukan
    console.log(`🤖 Gemini menemukan ${cleanedData.listings.length} data.`);
    
    const jobList = cleanedData.listings;

    if (jobList.length === 0) {
      return NextResponse.json({ success: false, message: "Tidak ada data yang ditemukan oleh AI." }, { status: 404 });
    }

    // ------------------------------------------------------------------
    // STEP C: Prepare & Save to MongoDB
    // ------------------------------------------------------------------
    const jobsToSave = jobList.map((job) => ({
      url: url, // URL sumber (list page)
      job_title: job.job_title,
      company: job.company,
      location: job.location,
      requirements_text: job.requirements_text || "Lihat detail di link",
      label_skill: job.label_skill || "",
      url_lowongan: job.url_lowongan || url, 
    }));
    await DataJob.insertMany(jobsToSave);

    console.log(`✅ Berhasil menyimpan ${jobsToSave.length} lowongan ke DB.`);

    return NextResponse.json({ 
        success: true, 
        count: jobsToSave.length,
        data: jobsToSave 
    }, { status: 200 });

  } catch (err: any) {
    console.error("Pipeline Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}