import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArticle } from "@/lib/articles";
import { articleHead } from "@/lib/seo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    if (!getArticle(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const a = getArticle(params.slug);
    return a ? articleHead(a) : {};
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug);
  if (!article) return null;

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
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link to="/articles" className="hover:text-foreground">
            Articles
          </Link>
        </nav>

        <article className="mt-4">
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatDate(article.datePublished)} · {article.readMins} min read
          </p>
          <div className="mt-2">{article.body()}</div>
        </article>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-serif text-xl text-foreground">Ready to try it yourself?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate all your Gmail dot variations - free, private, in your browser.
          </p>
          <Button asChild className="mt-4 rounded-xl h-11 px-6">
            <Link to="/">
              Open generator
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Link
          to="/articles"
          className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All articles
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
