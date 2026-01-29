/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight, Bot, Terminal } from "lucide-react";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });
      
      gsap.from(".animate-line", {
        scaleX: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "expo.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none font-mono text-[10px] leading-none overflow-hidden select-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap">
            {`0x${Math.random().toString(16).slice(2, 10).toUpperCase()} CRITICAL_EXTRACTION_SEQUENCE_INITIALIZED_RUNNING_DATA_MINING_` .repeat(10)}
          </div>
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex items-center gap-2 mb-8 animate-text">
          <Bot className="w-6 h-6 text-primary" />
          <span className="font-mono text-sm tracking-[0.3em] uppercase opacity-60">System v3.0 // Ready</span>
        </div>

        <h1 className="text-[12vw] lg:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-8 italic uppercase">
          <div className="overflow-hidden">
            <div className="animate-text">Intelligence</div>
          </div>
          <div className="overflow-hidden">
            <div className="animate-text text-primary">Engine.</div>
          </div>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-6">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl animate-text">
              Automasi ekstraksi data web dengan presisi tingkat tinggi. Ubah struktur DOM yang kompleks menjadi dataset terstruktur dalam hitungan detik.
            </p>
          </div>
          
          <div className="lg:col-span-6 flex flex-col items-start lg:items-end gap-6">
            <div className="animate-text">
              <SignInButton mode="modal">
                <Button size="lg" className="h-16 px-10 text-lg rounded-none group">
                  Initialize Sequence
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs opacity-40 animate-text">
              <Terminal className="w-4 h-4" />
              <span>LOG: AWAITING_USER_AUTHENTICATION</span>
            </div>
          </div>
        </div>

        <div className="mt-20 h-px bg-border w-full animate-line origin-left" />
      </div>
    </section>
  );
}