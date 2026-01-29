"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Bagaimana cara kerja VIVA?",
    a: "Sistem kami menggunakan Firecrawl Engine untuk melakukan crawling mendalam dan menormalisasi data menggunakan model AI yang dilatih khusus untuk mendeteksi pola pekerjaan."
  },
  {
    q: "Apakah mendukung ekspor format lain selain CSV?",
    a: "Saat ini sistem dioptimalkan untuk CSV guna integrasi data mining. Dukungan JSON dan API endpoint sedang dalam tahap pengembangan."
  },
  {
    q: "Berapa batas limit crawling harian?",
    a: "VIVA dirancang untuk skalabilitas. Batas ditentukan oleh tingkat otentikasi akun Anda."
  }
];

export default function FAQ() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".faq-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic">
              System <br /> <span className="text-primary">Inquiry</span>
            </h2>
            <p className="mt-4 text-muted-foreground font-mono text-sm">
              [Common technical questions regarding the extraction process]
            </p>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item group border-b border-border/50 pb-8">
                <span className="font-mono text-xs text-primary mb-4 block">0{i + 1} —</span>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors cursor-default">
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}