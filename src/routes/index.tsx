import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Facebook, Youtube, Send, ShieldCheck, Lock, Zap, Sparkles } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GeneratorCard } from "@/components/generator/GeneratorCard";
import { ResultsList } from "@/components/generator/ResultsList";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { HistoryButton } from "@/components/layout/HistoryButton";
import { generateDotVariants } from "@/lib/dot-variants";
import { addRecent } from "@/lib/recent-usernames";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DotMail | Generator Variasi Titik Gmail" },
      {
        name: "description",
        content:
          "Buat semua variasi titik Gmail dalam sekejap. Gratis, privat, jalan sepenuhnya di browser.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "DotMail | Generator Variasi Titik Gmail" },
      {
        property: "og:description",
        content:
          "Tool gratis buat nge-generate semua kombinasi titik Gmail. Privasi aman, tanpa server.",
      },
      { property: "og:url", content: "https://dotmail.lovable.app/" },
      { property: "og:image", content: "https://dotmail.lovable.app/og-image.png" },
      { property: "og:image:width", content: "1216" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:alt", content: "DotMail | Generator Variasi Titik Gmail" },
      { name: "twitter:title", content: "DotMail | Generator Variasi Titik Gmail" },
      {
        name: "twitter:description",
        content:
          "Tool gratis buat nge-generate semua kombinasi titik Gmail. Privasi aman, tanpa server.",
      },
      { name: "twitter:image", content: "https://dotmail.lovable.app/og-image.png" },
      { name: "twitter:image:alt", content: "DotMail | Generator Variasi Titik Gmail" },
    ],
    links: [{ rel: "canonical", href: "https://dotmail.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Legal?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Iya. Ini fitur bawaan Gmail. Google nggak peduli titik di username, jadi semua variasi tetap masuk inbox yang sama. Bukan hack.",
              },
            },
            {
              "@type": "Question",
              name: "Akun saya bisa diblokir?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Kalau dipakai normal, aman-aman aja. Risikonya cuma kalau disalahgunain buat spam atau daftar masif yang melanggar aturan layanan lain.",
              },
            },
            {
              "@type": "Question",
              name: "Data simpan di mana?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Nggak disimpan di mana-mana. Semua dihitung di browser kamu sendiri. Nggak ada server, nggak ada database, nggak ada yang ngintip input.",
              },
            },
            {
              "@type": "Question",
              name: "Bisa buat apa aja?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Filter email per layanan, ngecek siapa yang bocorin email kamu (pakai alamat unik tiap daftar), atau kelola banyak akun dari satu inbox.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.5 8.4a6.6 6.6 0 0 1-4-1.3v7.5a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2 2.8V2h2.6a4 4 0 0 0 4 4z" />
    </svg>
  );
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.3 2H21l-6.5 7.4L22 22h-6.8l-5.3-6.9L3.8 22H1l7-8L1.5 2h6.9l4.8 6.3zM17 20h1.7L7.1 4H5.3z" />
    </svg>
  );
}

function Index() {
  const [variants, setVariants] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [externalValue, setExternalValue] = useState<string | undefined>(undefined);
  const [recentVersion, setRecentVersion] = useState(0);

  function handleGenerate(u: string) {
    setUsername(u);
    setVariants(generateDotVariants(u));
    setExternalValue(u);
    addRecent(u);
    setRecentVersion((v) => v + 1);

    // Smooth scroll to results after render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-results-section]");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Skip if user is already at/near results
        if (rect.top > 0 && rect.top < 200) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Keyboard shortcuts
  useEffect(() => {
    function isTyping(el: EventTarget | null) {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    }

    function handler(e: KeyboardEvent) {
      // "/" focuses input
      if (e.key === "/" && !isTyping(e.target)) {
        const input = document.querySelector<HTMLInputElement>("[data-username-input]");
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        }
        return;
      }

      // Cmd/Ctrl+A copies all when results exist and focus is outside input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a" && variants.length > 0 && !isTyping(e.target)) {
        e.preventDefault();
        const all = variants.map((v) => `${v}@gmail.com`).join("\n");
        navigator.clipboard.writeText(all).then(() => {
          toast.success(`Disalin ${variants.length.toLocaleString("id-ID")} email`);
        });
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [variants]);

  const socials = [
    { href: "https://alfindigital.com", Icon: Globe, label: "Website" },
    { href: "https://facebook.com/alfindigital", Icon: Facebook, label: "Facebook" },
    { href: "https://youtube.com/@alfindigital", Icon: Youtube, label: "YouTube" },
    { href: "https://tiktok.com/@alfindigital", Icon: TiktokIcon, label: "TikTok" },
    { href: "https://x.com/alfindigital", Icon: XIcon, label: "X" },
    { href: "https://t.me/alfindigital", Icon: Send, label: "Telegram" },
  ];

  const steps = [
    { title: "1. Ketik username", desc: "sebelum @gmail.com." },
    { title: "2. Generate", desc: "Langsung keluar semua kombinasi." },
    { title: "3. Salin & pakai", desc: "Salin atau unduh .txt/.csv." },
  ];

  const faqs = [
    {
      q: "Legal?",
      a: "Iya. Ini fitur bawaan Gmail. Google nggak peduli titik di username, jadi semua variasi tetap masuk inbox yang sama. Bukan hack.",
    },
    {
      q: "Akun saya bisa diblokir?",
      a: "Kalau dipakai normal, aman-aman aja. Risikonya cuma kalau disalahgunain buat spam atau daftar masif yang melanggar aturan layanan lain.",
    },
    {
      q: "Data simpan di mana?",
      a: "Nggak disimpan di mana-mana. Semua dihitung di browser kamu sendiri. Nggak ada server, nggak ada database, nggak ada yang ngintip input.",
    },
    {
      q: "Bisa buat apa aja?",
      a: "Filter email per layanan, ngecek siapa yang bocorin email kamu (pakai alamat unik tiap daftar), atau kelola banyak akun dari satu inbox.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />

      <header className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="font-serif text-xl tracking-tight">DotMail</span>
          </div>
          <div className="flex items-center gap-1">
            <HistoryButton onPick={handleGenerate} recentVersion={recentVersion} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-20 pb-24">
        <section className="text-center mb-10 sm:mb-14">
          <p className="mb-4 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Gratis</span>
            <span aria-hidden>·</span>
            <span>Jalan di browser</span>
            <span aria-hidden>·</span>
            <span>Tanpa login</span>
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] text-foreground">
            Satu inbox.{" "}
            <span className="italic text-accent">Ratusan</span> alamat.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Gmail nggak peduli titik di username. Semua variasi masuk ke inbox yang sama.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/80 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Filter Gmail</span>
            <span aria-hidden>·</span>
            <span>Testing form</span>
            <span aria-hidden>·</span>
            <span>Kelola multi-akun</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {["s.atu", "sa.tu", "sat.u", "satu"].map((ex) => (
              <span
                key={ex}
                className="font-mono text-xs px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground"
              >
                {ex}
              </span>
            ))}
          </div>
        </section>



        <GeneratorCard
          onGenerate={handleGenerate}
          externalValue={externalValue}
        />

        {variants.length > 0 ? (
          <ResultsList variants={variants} username={username} />
        ) : (
          <>
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 flex flex-col items-center justify-center text-center">
              <Sparkles className="size-5 text-muted-foreground/60 mb-2" />
              <p className="text-sm text-muted-foreground">
                Hasil akan muncul di sini setelah kamu generate.
              </p>
            </div>
            <section className="mt-10 sm:mt-14">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-6">
                Cara Pakai
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {steps.map(({ title, desc }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <h3 className="font-serif text-base text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}


        <section className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
            Pertanyaan
          </h2>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-0 px-5">
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { Icon: ShieldCheck, label: "100% di browser", desc: "Nggak ada yang dikirim ke server." },
            { Icon: Lock, label: "Tanpa login", desc: "Pakai langsung, nggak perlu daftar." },
            { Icon: Zap, label: "Instan", desc: "Ribuan kombinasi dihitung di laptopmu." },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background shrink-0">
                <Icon className="size-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-6 flex flex-col items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span>Tekan</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/40 font-mono text-[10px] text-foreground">/</kbd>
            <span>untuk fokus input</span>
            <span aria-hidden>·</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/40 font-mono text-[10px] text-foreground">⌘ A</kbd>
            <span>untuk salin semua</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>
              by{" "}
              <a
                href="https://www.instagram.com/alfindigital"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground hover:text-accent transition"
              >
                @alfindigital
              </a>
            </span>
            <span className="text-border">|</span>
            <div className="flex items-center gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-accent transition"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
