import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/articles";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Gmail Dot Trick Articles - DotMail" },
      {
        name: "description",
        content:
          "Guides and tips about the Gmail dot trick: how to filter email, detect leaks, and more.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Gmail Dot Trick Articles - DotMail" },
      { property: "og:url", content: abs("/articles") },
    ],
    links: [{ rel: "canonical", href: abs("/articles") }],
  }),
  component: ArticleIndex,
});

function ArticleIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="font-serif text-xl tracking-tight">DotMail</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-2xl px-5 sm:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to generator
        </Link>
        <h1 className="mt-4 font-serif text-4xl text-foreground">Articles</h1>
        <p className="mt-2 text-muted-foreground">
          Practical guides on the Gmail dot trick, filtering, and email privacy.
        </p>

        <div className="mt-8 space-y-4">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to="/articles/$slug"
              params={{ slug: a.slug }}
              className="group block rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50"
            >
              <h2 className="font-serif text-xl text-foreground leading-snug">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Read article
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
