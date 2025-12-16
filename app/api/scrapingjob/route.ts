/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import DataJob from "@/lib/database/models/datajobs.model";
import FirecrawlApp from "@mendable/firecrawl-js"; // Pastikan import ini benar sesuai versi SDK mu
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
        You are an expert Data Engineer. 
        Extract ALL job listings from the provided raw markdown below.
        
        RULES:
        1. Ignore navigation links, footers, login buttons, and generic site text.
        2. Focus strictly on the list of jobs.
        3. If requirements are truncated, just take what is visible.
        4. "label_skill" should be comma-separated keywords found in the text (e.g., "React, Node.js").
        
        RAW MARKDOWN:
        ${scrapeRes.markdown}
      `,
    });

    // DEBUG: Cek apa yang Gemini temukan
    console.log(`🤖 Gemini menemukan ${cleanedData.listings.length} data.`);

    // [FIX 1] Akses langsung .listings (karena schema kita ada di root object)
    // Jangan pakai .extract.listings, itu format Firecrawl native, bukan Vercel AI SDK.
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
      // Jika AI dapat link spesifik, simpan. Jika tidak, pakai URL list page
      url_lowongan: job.url_lowongan || url, 
    }));

    // [FIX 2] EKSEKUSI SIMPAN KE DB (PENTING!)
    // Kamu sebelumnya lupa baris ini, makanya DB kosong.
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