import { Filter, ShieldAlert, Inbox, FlaskConical } from "lucide-react";
import { useT } from "@/lib/i18n";

const ICONS = [Filter, ShieldAlert, Inbox, FlaskConical];

export function WhySection() {
  const t = useT();
  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="why-heading">
      <h2 id="why-heading" className="font-serif text-3xl sm:text-4xl text-foreground">
        {t.whyTitle}
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl">{t.whyIntro}</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {t.useCases.map((uc, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={uc.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-content-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="size-4.5" />
                </span>
                <h3 className="font-serif text-lg text-foreground">{uc.title}</h3>
              </div>
              <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
