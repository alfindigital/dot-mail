import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT, type Lang } from "@/lib/i18n";

export function InfoButton({ lang }: { lang: Lang }) {
  const t = useT();
  return (
    <Button asChild variant="ghost" size="icon" aria-label={t.infoButton} className="rounded-full">
      <Link to={lang === "id" ? "/info" : "/en/info"}>
        <Info className="size-4" />
      </Link>
    </Button>
  );
}
