import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n";

export function InfoButton() {
  const t = useT();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.infoButton} className="rounded-full">
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{t.infoTitle}</DialogTitle>
        </DialogHeader>

        <section className="mt-2">
          <h3 className="font-serif text-lg text-foreground mb-3">{t.howToTitle}</h3>
          <div className="grid grid-cols-1 gap-2">
            {t.steps.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card px-4 py-3">
                <h4 className="font-serif text-base text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-serif text-lg text-foreground mb-3">{t.faqTitle}</h3>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden"
          >
            {t.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-0 px-4">
                <AccordionTrigger className="text-left text-sm font-serif font-medium hover:no-underline py-3">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-3">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </DialogContent>
    </Dialog>
  );
}
