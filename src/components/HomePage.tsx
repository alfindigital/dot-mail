import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { GeneratorCard, type GenerateResult } from "@/components/generator/GeneratorCard";
import { ResultsList } from "@/components/generator/ResultsList";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { HistoryButton } from "@/components/layout/HistoryButton";
import { InfoButton } from "@/components/layout/InfoButton";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ArticleTeaser } from "@/components/sections/ArticleTeaser";
import { generateDotVariants, validateUsername } from "@/lib/dot-variants";
import { addRecent, getLabelsFor } from "@/lib/recent-usernames";
import { useT } from "@/lib/i18n";

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export function HomePage() {
  const t = useT();
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [externalValue, setExternalValue] = useState<string | undefined>(undefined);
  const [initialLabels, setInitialLabels] = useState<Record<string, string>>({});

  function handleGenerate(r: GenerateResult) {
    setResult(r);
    addRecent(r.username);
    setInitialLabels(getLabelsFor(r.username));

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("u", r.username);
      window.history.replaceState(null, "", url);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-results-section]");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > 0 && rect.top < 200) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function handlePick(u: string) {
    setExternalValue(u);
    handleGenerate({ username: u, variants: generateDotVariants(u) });
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URLSearchParams(window.location.search).get("u");
    if (!u) return;
    const res = validateUsername(u);
    if (res.valid) handlePick(res.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "/" && !isTyping(e.target)) {
        const input = document.querySelector<HTMLInputElement>("[data-username-input]");
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Toaster position="top-center" />

      <header className="bg-background text-foreground border-b border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="size-2.5 rounded-full bg-accent shrink-0" />
            <span className="font-serif text-xl tracking-tight">DotMail</span>
          </div>
          <div className="flex items-center gap-1.5">
            <InfoButton />
            <HistoryButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 w-full mx-auto max-w-3xl px-5 sm:px-8 pt-4 sm:pt-6 pb-12"
      >
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] text-foreground">
            {t.heroLine1}
            <br />
            <span className="italic text-accent">{t.heroEm}</span> {t.heroLine2}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-accent" />
            {t.trustBadge}
          </p>
        </section>

        <GeneratorCard onGenerate={handleGenerate} externalValue={externalValue} />

        {result && result.variants.length > 0 ? (
          <ResultsList
            variants={result.variants}
            username={result.username}
            initialLabels={initialLabels}
          />
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-accent" />
              <p className="text-sm text-muted-foreground">{t.emptyPlaceholder}</p>
            </div>
            <ul className="space-y-1.5 font-mono text-sm text-foreground select-none">
              {["one", "o.ne", "on.e", "o.n.e"].map((v) => (
                <li key={v} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-accent" />
                  <span>
                    {v.split(/(\.)/).map((p, i) =>
                      p === "." ? (
                        <span key={i} className="text-accent font-bold">.</span>
                      ) : (
                        <span key={i}>{p}</span>
                      ),
                    )}
                    <span className="text-muted-foreground">@gmail.com</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{t.emptyDemoHint}</p>
          </div>
        )}

        <ArticleTeaser />
      </main>

      <SiteFooter />
    </div>
  );
}
