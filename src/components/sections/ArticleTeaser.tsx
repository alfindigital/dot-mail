import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/articles";
import { useT } from "@/lib/i18n";

export function ArticleTeaser() {
  const t = useT();
  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="read-more-heading">
      <h2 id="read-more-heading" className="font-serif text-3xl sm:text-4xl text-foreground">
        {t.readMoreTitle}
      </h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            to="/articles/$slug"
            params={{ slug: a.slug }}
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-accent/50"
          >
            <h3 className="font-serif text-lg text-foreground leading-snug">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
              {t.readMoreCta}
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
