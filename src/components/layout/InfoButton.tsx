import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export function InfoButton() {
  const t = useT();
  return (
    <Button asChild variant="ghost" size="icon" aria-label={t.infoButton} className="rounded-full">
      <Link to="/info">
        <Info className="size-4" />
      </Link>
    </Button>
  );
}
