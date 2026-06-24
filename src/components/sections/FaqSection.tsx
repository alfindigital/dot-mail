import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n";

export function FaqSection() {
  const t = useT();
  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-serif text-3xl sm:text-4xl text-foreground">
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
  );
}
