import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Facebook, Youtube, Send, Keyboard, MousePointerClick, ClipboardCopy } from "lucide-react";
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
import { generateDotVariants } from "@/lib/dot-variants";
import { addRecent } from "@/lib/recent-usernames";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DotMail — Generator Variasi Titik Gmail" },
      {
        name: "description",
        content:
          "Hasilkan semua variasi titik (dot trick) alamat Gmail kamu secara instan. Gratis, privat, berjalan sepenuhnya di browser.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "DotMail — Generator Variasi Titik Gmail" },
      {
        property: "og:description",
        content:
          "Tool gratis untuk menghasilkan seluruh kombinasi titik pada alamat Gmail. Privasi terjaga, tanpa server.",
      },
      { property: "og:url", content: "https://dotmail.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://dotmail.lovable.app/" }],
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
    {
      Icon: Keyboard,
      title: "1. Ketik username",
      desc: "Masukkan bagian sebelum @gmail.com — minimal 2 karakter.",
    },
    {
      Icon: MousePointerClick,
      title: "2. Generate",
      desc: "DotMail menghitung semua kombinasi titik secara instan di browser.",
    },
    {
      Icon: ClipboardCopy,
      title: "3. Salin & pakai",
      desc: "Pilih per baris, salin terpilih, salin semua, atau unduh .txt/.csv.",
    },
  ];

  const faqs = [
    {
      q: "Apakah dot trick legal?",
      a: "Ya. Ini fitur resmi Gmail — Google mengabaikan titik di bagian username, jadi semua variasi diarahkan ke inbox yang sama. Bukan eksploit, bukan hack.",
    },
    {
      q: "Apakah Gmail bisa memblokir akun saya?",
      a: "Selama pemakaian wajar (mendaftar layanan, memfilter email), tidak ada masalah. Penyalahgunaan untuk spam atau pendaftaran massal yang melanggar ToS layanan lain tentu berisiko di sisi layanan tersebut, bukan di Gmail.",
    },
    {
      q: "Apakah data saya disimpan?",
      a: "Tidak. Semua perhitungan berjalan sepenuhnya di browser kamu. Tidak ada server, tidak ada database, tidak ada tracking input.",
    },
    {
      q: "Untuk apa biasanya digunakan?",
      a: "Filter email per layanan, mendeteksi siapa yang membocorkan email kamu (mis. dengan alamat unik per pendaftaran), dan mengelola banyak akun dari satu inbox.",
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
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-20 pb-24">
        <section className="text-center mb-10 sm:mb-14">
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] text-foreground">
            Satu inbox.{" "}
            <span className="italic text-accent">Ratusan</span> alamat.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Gmail mengabaikan titik di username — <span className="font-mono">s.atu</span>,{" "}
            <span className="font-mono">sa.tu</span>,{" "}
            <span className="font-mono">sat.u</span>, dan{" "}
            <span className="font-mono">satu</span> semua masuk ke inbox yang sama.
          </p>
        </section>

        <GeneratorCard
          onGenerate={handleGenerate}
          externalValue={externalValue}
          recentVersion={recentVersion}
        />

        {variants.length > 0 ? (
          <ResultsList variants={variants} username={username} />
        ) : (
          <section className="mt-10 sm:mt-14">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground text-center mb-6">
              Bagaimana cara pakai?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {steps.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
                >
                  <span className="inline-flex items-center justify-center size-10 rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-serif text-lg text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
            Pertanyaan umum
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

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
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
      </footer>
    </div>
  );
}
