import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT, type Lang } from "@/lib/i18n";

export function HistoryButton({ lang }: { lang: Lang }) {
  const t = useT();
  return (
    <Button asChild variant="ghost" size="icon" aria-label={t.historyButton} className="rounded-full">
      <Link to={lang === "id" ? "/riwayat" : "/en/riwayat"}>
        <History className="size-4" />
      </Link>
    </Button>
  );
}
