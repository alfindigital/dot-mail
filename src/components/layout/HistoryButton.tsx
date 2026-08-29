import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export function HistoryButton() {
  const t = useT();
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      aria-label={t.historyButton}
      className="rounded-full"
    >
      <Link to="/history">
        <History className="size-4" />
      </Link>
    </Button>
  );
}
