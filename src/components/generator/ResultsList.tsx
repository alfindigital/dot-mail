import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
}

const PAGE = 200;

function HighlightedEmail({ value }: { value: string }) {
  // Split into chars; render dots in accent color.
  return (
    <span className="font-mono text-sm break-all">
      {value.split("").map((c, i) =>
        c === "." ? (
          <span key={i} className="text-accent font-bold">
            .
          </span>
        ) : (
          <span key={i}>{c}</span>
        ),
      )}
      <span className="text-muted-foreground">@gmail.com</span>
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Salin"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition rounded-md p-1.5 hover:bg-muted text-muted-foreground"
    >
      {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
    </button>
  );
}

export function ResultsList({ variants, username }: Props) {
  const [shown, setShown] = useState(PAGE);

  if (variants.length === 0) return null;

  const visible = variants.slice(0, shown);
  const remaining = variants.length - shown;

  async function copyAll() {
    const all = variants.map((v) => `${v}@gmail.com`).join("\n");
    await navigator.clipboard.writeText(all);
    toast.success(`Disalin ${variants.length.toLocaleString("id-ID")} email`);
  }

  return (
    <section className="mt-8">
      <header className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
            {variants.length.toLocaleString("id-ID")} variasi
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            untuk <span className="font-mono text-foreground">{username}@gmail.com</span>
          </p>
        </div>
        <Button onClick={copyAll} variant="outline" className="rounded-xl h-10">
          <Copy className="size-4" />
          Salin semua
        </Button>
      </header>

      <ol className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {visible.map((v, i) => {
          const full = `${v}@gmail.com`;
          return (
            <li
              key={i}
              className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-muted-foreground tabular-nums w-10 shrink-0">
                  {(i + 1).toString().padStart(3, "0")}
                </span>
                <HighlightedEmail value={v} />
              </div>
              <CopyButton text={full} />
            </li>
          );
        })}
      </ol>

      {remaining > 0 && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setShown((s) => s + PAGE)}
            className="rounded-xl"
          >
            Tampilkan {Math.min(PAGE, remaining).toLocaleString("id-ID")} lagi · sisa{" "}
            {remaining.toLocaleString("id-ID")}
          </Button>
        </div>
      )}
    </section>
  );
}
