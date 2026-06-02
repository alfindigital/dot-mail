import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getRecent, removeRecent } from "@/lib/recent-usernames";

interface Props {
  onPick: (username: string) => void;
  recentVersion?: number;
}

export function HistoryButton({ onPick, recentVersion }: Props) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecent());
  }, [recentVersion, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Riwayat username"
          className="rounded-full"
        >
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Riwayat username</DialogTitle>
        </DialogHeader>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Belum ada riwayat. Generate username untuk mulai menyimpan.
          </p>
        ) : (
          <ul className="divide-y divide-border -mx-2">
            {recent.map((u) => (
              <li key={u} className="flex items-center gap-2 px-2">
                <button
                  type="button"
                  onClick={() => {
                    onPick(u);
                    setOpen(false);
                  }}
                  className="flex-1 text-left py-3 font-mono text-sm hover:text-accent transition"
                >
                  {u}
                  <span className="text-muted-foreground">@gmail.com</span>
                </button>
                <button
                  type="button"
                  aria-label={`Hapus ${u}`}
                  onClick={() => setRecent(removeRecent(u))}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
