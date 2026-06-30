import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhySection } from "@/components/sections/WhySection";
import { LangProvider, useT, type Lang } from "@/lib/i18n";

function InfoInner({ lang }: { lang: Lang }) {
  const t = useT();
  const backTo = lang === "id" ? "/" : "/en";
  const backLabel = lang === "id" ? "Kembali ke generator" : "Back to generator";

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
          {backLabel}
        </Link>
        <h1 className="mt-4 font-serif text-4xl text-foreground">{t.infoTitle}</h1>

        <section className="mt-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">{t.howToTitle}</h2>
          <div className="mt-6 grid grid-cols-1 gap-2">
            {t.steps.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card px-4 py-3">
                <h3 className="font-serif text-base text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <WhySection />

        <section className="mt-16 sm:mt-20" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="font-serif text-3xl sm:text-4xl text-foreground"
          >
            {t.onPageFaqTitle}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="mt-6 rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden"
          >
            {t.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-0 px-5">
                <AccordionTrigger className="text-left font-serif text-base font-medium hover:no-underline py-4">
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

      <SiteFooter />
    </div>
  );
}

export function InfoPage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <InfoInner lang={lang} />
    </LangProvider>
  );
}
