import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  getRecent,
  removeRecent,
  subscribeRecent,
  type RecentEntry,
} from "@/lib/recent-usernames";
import { LangProvider, useT, type Lang } from "@/lib/i18n";

function HistoryInner({ lang }: { lang: Lang }) {
  const t = useT();
  const navigate = useNavigate();
  const backTo = lang === "id" ? "/" : "/en";
  const [recent, setRecent] = useState<RecentEntry[]>([]);

  useEffect(() => {
    setRecent(getRecent());
    return subscribeRecent(setRecent);
  }, []);

  function pick(u: string) {
    navigate({ to: backTo, search: { u } as never });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-2.5 flex items-center justify-between">
          <Link to={backTo} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="font-serif text-xl tracking-tight">DotMail</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-2xl px-5 sm:px-8 py-8">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t.historyBack}
        </Link>
        <h1 className="mt-4 font-serif text-4xl text-foreground">{t.historyTitle}</h1>

        {recent.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">{t.historyEmpty}</p>
        ) : (
          <ul className="mt-6 rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {recent.map((entry) => {
              const labels = Object.values(entry.labels ?? {});
              const uniqLabels = [...new Set(labels)];
              return (
                <li key={entry.u} className="flex items-center gap-2 px-4">
                  <button
                    type="button"
                    onClick={() => pick(entry.u)}
                    className="flex-1 text-left py-4 hover:text-accent transition"
                  >
                    <span className="font-mono text-sm">
                      {entry.u}
                      <span className="text-muted-foreground">@gmail.com</span>
                    </span>
                    {uniqLabels.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {uniqLabels.map((l) => (
                          <span
                            key={l}
                            className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={`${lang === "id" ? "Hapus" : "Remove"} ${entry.u}`}
                    onClick={() => setRecent(removeRecent(entry.u))}
                    className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

export function HistoryPage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <HistoryInner lang={lang} />
    </LangProvider>
  );
}
