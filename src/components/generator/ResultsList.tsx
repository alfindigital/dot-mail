import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
}

const PAGE = 200;

function HighlightedEmail({ value, animate }: { value: string; animate: boolean }) {
  let dotIndex = 0;
  return (
    <span className="font-mono text-sm break-all">
      {value.split("").map((c, i) => {
        if (c === ".") {
          const delay = Math.min(dotIndex * 18, 400);
          dotIndex++;
          return (
            <span
              key={i}
              className={animate ? "dot-stagger text-accent font-bold" : "text-accent font-bold"}
              style={animate ? ({ ["--dot-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined}
            >
              .
            </span>
          );
        }
        return <span key={i}>{c}</span>;
      })}
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
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Disalin", { duration: 1200 });
        setTimeout(() => setCopied(false), 1200);
      }}
      className="sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition rounded-md p-1.5 hover:bg-muted text-muted-foreground shrink-0"
    >
      {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
    </button>
  );
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ResultsList({ variants, username }: Props) {
  const [shown, setShown] = useState(PAGE);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Reset on new generation
  useEffect(() => {
    setShown(PAGE);
    setSelected(new Set());
  }, [username, variants]);

  const visible = useMemo(() => variants.slice(0, shown), [variants, shown]);
  const remaining = variants.length - shown;

  if (variants.length === 0) return null;

  const allOnPageSelected = visible.length > 0 && visible.every((_, i) => selected.has(i));

  function toggleAllOnPage() {
    const next = new Set(selected);
    if (allOnPageSelected) {
      visible.forEach((_, i) => next.delete(i));
    } else {
      visible.forEach((_, i) => next.add(i));
    }
    setSelected(next);
  }

  function toggleOne(i: number) {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  }

  async function copyAll() {
    const all = variants.map((v) => `${v}@gmail.com`).join("\n");
    await navigator.clipboard.writeText(all);
    toast.success(`Disalin ${variants.length.toLocaleString("id-ID")} email`);
  }

  async function copySelected() {
    const list = Array.from(selected)
      .sort((a, b) => a - b)
      .map((i) => `${variants[i]}@gmail.com`)
      .join("\n");
    await navigator.clipboard.writeText(list);
    toast.success(`Disalin ${selected.size.toLocaleString("id-ID")} email terpilih`);
  }

  function downloadTxt() {
    const content = variants.map((v) => `${v}@gmail.com`).join("\n");
    download(`dotmail-${username}.txt`, content, "text/plain");
  }

  function downloadCsv() {
    const lines = ["email,dots"];
    for (const v of variants) {
      const dots = (v.match(/\./g) || []).length;
      lines.push(`${v}@gmail.com,${dots}`);
    }
    download(`dotmail-${username}.csv`, lines.join("\n"), "text/csv");
  }

  return (
    <section className="mt-8">
      <div className="sticky top-0 z-10 -mx-5 sm:-mx-8 px-5 sm:px-8 py-3 bg-background/85 backdrop-blur border-b border-border/60 mb-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
              {variants.length.toLocaleString("id-ID")} variasi
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              untuk <span className="font-mono text-foreground">{username}@gmail.com</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 && (
              <Button onClick={copySelected} variant="default" className="rounded-xl h-10">
                <Copy className="size-4" />
                Salin terpilih ({selected.size.toLocaleString("id-ID")})
              </Button>
            )}
            <Button onClick={copyAll} variant="outline" className="rounded-xl h-10">
              <Copy className="size-4" />
              Salin
            </Button>
            <Button onClick={downloadTxt} variant="outline" className="rounded-xl h-10" title="Unduh sebagai .txt">
              <FileText className="size-4" />
              .txt
            </Button>
            <Button onClick={downloadCsv} variant="outline" className="rounded-xl h-10" title="Unduh sebagai .csv">
              <Download className="size-4" />
              .csv
            </Button>
          </div>
        </header>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 mb-2 text-xs text-muted-foreground">
        <Checkbox
          checked={allOnPageSelected}
          onCheckedChange={toggleAllOnPage}
          aria-label="Pilih semua di halaman"
        />
        <span>Pilih semua yang tampil ({visible.length.toLocaleString("id-ID")})</span>
      </div>

      <ol className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {visible.map((v, i) => {
          const full = `${v}@gmail.com`;
          const isSelected = selected.has(i);
          return (
            <li
              key={i}
              className={`group flex items-center justify-between gap-3 px-4 py-3 transition cursor-pointer ${
                isSelected ? "bg-accent/5" : "hover:bg-muted/40"
              }`}
              onClick={() => toggleOne(i)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleOne(i)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Pilih ${full}`}
                />
                <span className="text-xs text-muted-foreground tabular-nums w-10 shrink-0">
                  {(i + 1).toString().padStart(3, "0")}
                </span>
                <HighlightedEmail value={v} animate={i < PAGE} />
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
