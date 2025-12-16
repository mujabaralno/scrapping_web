/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Bot,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Activity,
  ArrowRight,
  Terminal,
  Download, FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ModeToggle } from "@/components/toggle/mode-toggle";

// Tipe Data
type Job = {
  _id: string;
  url: string;
  job_title: string;
  company: string;
  location: string;
  requirements_text: string;
  label_skill?: string;
};

type LogEntry = {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  timestamp: string;
};

export default function CrawlPage() {
  // --- STATE MANAGEMENT ---
  const [url, setUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- PAGINATION TABLE STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stopSignal = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Helper: Tambah Log
  const addLog = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
    const uniqueId = Date.now() + Math.random();

    setLogs((prev) =>
      [{ id: uniqueId, message, type, timestamp }, ...prev].slice(0, 100)
    );
  };

  // --- CORE LOGIC ---
  const handleCrawl = async () => {
    if (!url) {
      toast.error("Please enter a valid target URL");
      addLog("ERROR: Input validation failed (Empty URL).", "error");
      return;
    }

    setIsCrawling(true);
    stopSignal.current = false;
    setProgress(5);
    setLogs([]);
    addLog(`🚀 INITIALIZING AI AGENT FOR: ${url}`, "info");

    try {
      addLog(`📡 Establish connection to Firecrawl Engine...`, "info");

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.random() * 5 : prev));
      }, 800);

      const res = await fetch("/api/scrapingjob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });

      clearInterval(progressInterval);

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      const count = result.data?.length || 0;

      if (count > 0) {
        setProgress(100);
        addLog(
          `✅ EXTRACTION COMPLETE: ${count} structured records found.`,
          "success"
        );
        toast.success(`${count} New jobs added to database.`);
      } else {
        setProgress(100);
        addLog(
          `⚠️ ANALYSIS COMPLETE: No relevant data patterns found.`,
          "info"
        );
      }

      await fetchJobs();
    } catch (error: any) {
      setProgress(0);
      addLog(`❌ SYSTEM FAILURE: ${error.message}`, "error");
      toast.error("Extraction failed.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleStop = () => {
    stopSignal.current = true;
    setIsCrawling(false);
    addLog("🛑 PROCESS ABORTED BY USER OVERRIDE", "error");
  };

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- FILTER & PAGINATION ---
  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.label_skill?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleExportCSV = () => {
    if (jobs.length === 0) {
      toast.error("No data to export.");
      return;
    }

    // 1. Define Headers
    const headers = [
      "Job Title",
      "Company",
      "Location",
      "Skills",
      "URL",
      "Requirements (Raw)"
    ];

    // 2. Convert Data to CSV Format
    const csvRows = jobs.map(job => {
      // Helper untuk membersihkan teks agar tidak merusak format CSV
      // Kita bungkus pakai tanda kutip "..." dan escape kutip di dalam teks
      const safeText = (text: string) => `"${(text || "").replace(/"/g, '""')}"`;

      return [
        safeText(job.job_title),
        safeText(job.company),
        safeText(job.location),
        safeText(job.label_skill || ""),
        safeText(job.url),
        safeText(job.requirements_text) // Sertakan ini untuk analisis NLP nanti
      ].join(",");
    });

    // 3. Gabungkan Header dan Rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. Buat Blob dan Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    // Nama file dinamis dengan tanggal
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `job_dataset_${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog(`💾 DATA EXPORTED: ${jobs.length} records saved to CSV.`, "success");
    toast.success("Dataset downloaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 1. NAVBAR TERPISAH (Sesuai Rules) */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80">
        <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight text-sm">
              Intelligence Engine <span className="text-muted-foreground font-normal opacity-50 ml-1">v3.0</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
             <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${isCrawling ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                {isCrawling ? "PROCESSING" : "IDLE"}
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {/* TOP SECTION: Input & Logs Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* LEFT: Controls (Clean, no boxes) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Data Extraction
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Enter a target URL to initiate the intelligent scraping sequence. 
                The system will auto-detect pagination and structures.
              </p>
            </div>

            <div className="space-y-4">
               <div className="relative">
                  <Input
                    placeholder="https://example.com/jobs"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 text-lg px-4 border-2 focus-visible:ring-0 focus-visible:border-primary transition-all rounded-none"
                    disabled={isCrawling}
                  />
                  {isCrawling && (
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        className="absolute bottom-0 left-0 h-1 bg-primary origin-left w-full"
                    />
                  )}
               </div>

               <div className="flex gap-3">
                  {!isCrawling ? (
                    <Button 
                        onClick={handleCrawl} 
                        size="lg" 
                        className="rounded-none px-8 font-medium"
                    >
                        <Play className="w-4 h-4 mr-2" /> Start Sequence
                    </Button>
                  ) : (
                    <Button 
                        onClick={handleStop} 
                        variant="destructive" 
                        size="lg" 
                        className="rounded-none px-8 font-medium"
                    >
                        <Square className="w-4 h-4 mr-2" /> Abort
                    </Button>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-8 pt-4 border-t border-border">
                <div>
                    <div className="text-3xl font-mono font-bold">{jobs.length}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Records</div>
                </div>
                <div>
                    <div className="text-3xl font-mono font-bold">{isCrawling ? Math.round(progress) + "%" : "-"}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Completion</div>
                </div>
            </div>
          </div>

          {/* RIGHT: Logs (Raw Feed Style) */}
          <div className="lg:col-span-6 relative">
            <div className="h-full min-h-[400px] border-l border-border pl-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    <Terminal className="w-4 h-4" /> System Activity Log
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-4 space-y-3 font-mono text-xs">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="grid grid-cols-[80px_1fr] gap-4 group"
                                >
                                    <span className="text-muted-foreground/40">{log.timestamp}</span>
                                    <span className={`${
                                        log.type === 'error' ? 'text-red-500 font-bold' : 
                                        log.type === 'success' ? 'text-emerald-500 font-bold' : 
                                        'text-muted-foreground group-hover:text-foreground transition-colors'
                                    }`}>
                                        {log.type === 'info' && <span className="mr-2 text-primary">➜</span>}
                                        {log.message}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {logs.length === 0 && (
                            <div className="h-full flex flex-col items-start justify-center text-muted-foreground/20">
                                <Activity className="w-16 h-16 mb-4 stroke-1" />
                                <p className="text-sm">Awaiting commands...</p>
                            </div>
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Data Table */}
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-4">
                <h2 className="text-xl font-semibold tracking-tight">Extracted Repository</h2>
                <div className="relative w-full md:w-72 flex">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter data..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 border-none shadow-none rounded-none border-b border-transparent"
                    />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportCSV}
                  className="h-10 border-dashed"
                  disabled={jobs.length === 0}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                  Export CSV
                </Button>
            </div>

            <div className="rounded-none border-none">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                            <TableHead className="w-20 font-mono text-xs uppercase text-muted-foreground">ID</TableHead>
                            <TableHead className="text-xs uppercase text-muted-foreground">Position</TableHead>
                            <TableHead className="text-xs uppercase text-muted-foreground">Entity</TableHead>
                            <TableHead className="text-xs uppercase text-muted-foreground">Skills</TableHead>
                            <TableHead className="text-right text-xs uppercase text-muted-foreground">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                                    Empty repository. Start a crawl sequence to populate.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentData.map((job, idx) => (
                                <TableRow key={job._id} className="group border-b border-border/40 hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {(startIndex + idx + 1).toString().padStart(3, '0')}
                                    </TableCell>
                                    <TableCell className="font-medium text-base py-4">
                                        {job.job_title}
                                        <div className="md:hidden text-xs text-muted-foreground mt-1">{job.company}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                        {job.company}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {job.label_skill?.split(",").slice(0, 3).map((s, i) => (
                                                <span key={i} className="inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-1">
                                                    {s.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-primary hover:text-primary-foreground">
                                            <a href={job.url} target="_blank">
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Pagination */}
            {filteredJobs.length > 0 && (
                <div className="flex items-center justify-end gap-2 pt-4">
                    <span className="text-xs text-muted-foreground mr-4">
                        Page {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 rounded-none border-border"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 rounded-none border-border"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}