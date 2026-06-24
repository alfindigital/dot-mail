import { Link } from "@tanstack/react-router";
import type { Lang } from "@/lib/i18n";

export function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-muted/40 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      <Link
        to="/"
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "id"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-current={lang === "id" ? "page" : undefined}
        hrefLang="id"
      >
        ID
      </Link>
      <Link
        to="/en"
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "en"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-current={lang === "en" ? "page" : undefined}
        hrefLang="en"
      >
        EN
      </Link>
    </div>
  );
}
