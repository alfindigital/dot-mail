import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, Copy, Download, FileText, Search, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
}

const PAGE = 200;

type DotFilter = "all" | "0" | "1-2" | "3-4" | "5+";

function dotCount(s: string) {
  let c = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === ".") c++;
  return c;
}

function matchesDotFilter(v: string, f: DotFilter) {
  if (f === "all") return true;
  const c = dotCount(v);
  if (f === "0") return c === 0;
  if (f === "1-2") return c >= 1 && c <= 2;
  if (f === "3-4") return c >= 3 && c <= 4;
  return c >= 5;
}

function HighlightedEmail({
  value,
  animate,
  query,
}: {
  value: string;
  animate: boolean;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const matchStart = q ? value.toLowerCase().indexOf(q) : -1;
  const matchEnd = matchStart >= 0 ? matchStart + q.length : -1;

  let dotIndex = 0;
  return (
    <span className="font-mono text-sm break-all">
      {value.split("").map((c, i) => {
        const inMatch = matchStart >= 0 && i >= matchStart && i < matchEnd;
        if (c === ".") {
          const delay = Math.min(dotIndex * 18, 400);
          dotIndex++;
          return (
            <span
              key={i}
              className={`${animate ? "dot-stagger " : ""}text-accent font-bold${
                inMatch ? " bg-accent/20 rounded-sm" : ""
              }`}
              style={animate ? ({ ["--dot-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined}
            >
              .
            </span>
          );
        }
        return (
          <span key={i} className={inMatch ? "bg-accent/20 rounded-sm" : undefined}>
            {c}
          </span>
        );
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
        toast.success("Disalin", { duration: 1000 });
        setTimeout(() => setCopied(false), 1200);
      }}
      className="opacity-30 sm:group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition rounded-md p-1.5 hover:bg-muted text-muted-foreground shrink-0"
    >
      {copied ? (
        <Check className="size-4 text-accent copy-pop" />
      ) : (
        <Copy className="size-4" />
      )}
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
  // Selection keyed by variant string so it survives filtering.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [dotFilter, setDotFilter] = useState<DotFilter>("all");

  // Reset on new generation
  useEffect(() => {
    setShown(PAGE);
    setSelected(new Set());
    setQuery("");
    setDotFilter("all");
  }, [username, variants]);

  // Indices of each variant in original list (for stable numbering).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: { v: string; idx: number }[] = [];
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (q && !v.toLowerCase().includes(q)) continue;
      if (!matchesDotFilter(v, dotFilter)) continue;
      out.push({ v, idx: i });
    }
    return out;
  }, [variants, query, dotFilter]);

  // Reset pagination when filter changes
  useEffect(() => {
    setShown(PAGE);
  }, [query, dotFilter]);

  const visible = useMemo(() => filtered.slice(0, shown), [filtered, shown]);
  const remaining = filtered.length - shown;
  const filterActive = query.trim().length > 0 || dotFilter !== "all";

  if (variants.length === 0) return null;

  const allVisibleSelected =
    visible.length > 0 && visible.every(({ v }) => selected.has(v));

  function toggleAllVisible() {
    const next = new Set(selected);
    if (allVisibleSelected) {
      visible.forEach(({ v }) => next.delete(v));
    } else {
      visible.forEach(({ v }) => next.add(v));
    }
    setSelected(next);
  }

  function selectAllFiltered() {
    const next = new Set(selected);
    filtered.forEach(({ v }) => next.add(v));
    setSelected(next);
  }

  function toggleOne(v: string) {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setSelected(next);
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function copyAll() {
    const all = variants.map((v) => `${v}@gmail.com`).join("\n");
    await navigator.clipboard.writeText(all);
    toast.success(`Disalin ${variants.length.toLocaleString("id-ID")} email`);
  }

  async function copyFiltered() {
    const list = filtered.map(({ v }) => `${v}@gmail.com`).join("\n");
    await navigator.clipboard.writeText(list);
    toast.success(`Disalin ${filtered.length.toLocaleString("id-ID")} email tersaring`);
  }

  async function copySelected() {
    // Preserve original generation order.
    const order = new Map<string, number>();
    variants.forEach((v, i) => order.set(v, i));
    const list = Array.from(selected)
      .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .map((v) => `${v}@gmail.com`)
      .join("\n");
    await navigator.clipboard.writeText(list);
    toast.success(`Disalin ${selected.size.toLocaleString("id-ID")} email terpilih`);
  }

  function downloadTxt() {
    const source = filterActive ? filtered.map((f) => f.v) : variants;
    const content = source.map((v) => `${v}@gmail.com`).join("\n");
    const suffix = filterActive ? "-tersaring" : "";
    download(`dotmail-${username}${suffix}.txt`, content, "text/plain");
  }

  function downloadCsv() {
    const source = filterActive ? filtered.map((f) => f.v) : variants;
    const lines = ["email,dots"];
    for (const v of source) {
      lines.push(`${v}@gmail.com,${dotCount(v)}`);
    }
    const suffix = filterActive ? "-tersaring" : "";
    download(`dotmail-${username}${suffix}.csv`, lines.join("\n"), "text/csv");
  }

  const dotFilters: { key: DotFilter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "0", label: "Tanpa titik" },
    { key: "1-2", label: "1–2 titik" },
    { key: "3-4", label: "3–4 titik" },
    { key: "5+", label: "5+ titik" },
  ];

  return (
    <section className="mt-8" data-results-section>
      <div className="sticky top-0 z-10 -mx-5 sm:-mx-8 px-5 sm:px-8 py-3 bg-background/85 backdrop-blur border-b border-border/60 mb-4">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
              {variants.length.toLocaleString("id-ID")} variasi
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              untuk <span className="font-mono text-foreground">{username}@gmail.com</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {selected.size > 0 && (
              <Button
                onClick={copySelected}
                variant="default"
                className="rounded-xl h-10 flex-1 sm:flex-none"
              >
                <Copy className="size-4" />
                Salin terpilih ({selected.size.toLocaleString("id-ID")})
              </Button>
            )}
            {filterActive && selected.size === 0 && (
              <Button
                onClick={copyFiltered}
                variant="default"
                className="rounded-xl h-10 flex-1 sm:flex-none"
              >
                <Copy className="size-4" />
                Salin tersaring ({filtered.length.toLocaleString("id-ID")})
              </Button>
            )}
            <Button onClick={copyAll} variant="outline" className="rounded-xl h-10 flex-1 sm:flex-none">
              <Copy className="size-4" />
              Salin semua
            </Button>
            <div className="inline-flex rounded-xl border border-input overflow-hidden h-10">
              <button
                onClick={downloadTxt}
                title={filterActive ? "Unduh hasil tersaring .txt" : "Unduh sebagai .txt"}
                className="flex items-center gap-1.5 px-3 text-sm hover:bg-muted transition"
              >
                <FileText className="size-4" />
                .txt
              </button>
              <span aria-hidden className="w-px bg-border" />
              <button
                onClick={downloadCsv}
                title={filterActive ? "Unduh hasil tersaring .csv" : "Unduh sebagai .csv"}
                className="flex items-center gap-1.5 px-3 text-sm hover:bg-muted transition"
              >
                <Download className="size-4" />
                .csv
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Search + dot filter */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pola titik, mis. s.a atau .tu"
            className="pl-9 pr-9 h-10 rounded-xl"
            aria-label="Cari variasi"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {dotFilters.map((f) => {
            const active = dotFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setDotFilter(f.key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-accent/50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          {filterActive && (
            <span className="text-xs text-muted-foreground ml-1">
              {filtered.length.toLocaleString("id-ID")} cocok
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 mb-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allVisibleSelected}
            onCheckedChange={toggleAllVisible}
            aria-label="Pilih semua yang tampil"
          />
          <span>Pilih yang tampil ({visible.length.toLocaleString("id-ID")})</span>
        </div>
        <div className="flex items-center gap-2">
          {filterActive && filtered.length > visible.length && (
            <button
              type="button"
              onClick={selectAllFiltered}
              className="underline hover:text-foreground transition"
            >
              Pilih semua tersaring ({filtered.length.toLocaleString("id-ID")})
            </button>
          )}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="underline hover:text-foreground transition"
            >
              Kosongkan pilihan
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak ada variasi yang cocok dengan filter saat ini.
          </p>
        </div>
      ) : (
        <ol className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {visible.map(({ v, idx }, pos) => {
            const full = `${v}@gmail.com`;
            const isSelected = selected.has(v);
            return (
              <li
                key={idx}
                className={`group relative flex items-center justify-between gap-3 px-4 py-3 transition cursor-pointer border-l-2 ${
                  isSelected
                    ? "bg-accent/5 border-l-accent"
                    : "border-l-transparent hover:bg-muted/40 hover:border-l-accent/40"
                }`}
                onClick={() => toggleOne(v)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(v)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Pilih ${full}`}
                  />
                  <span className="text-xs text-muted-foreground tabular-nums w-12 shrink-0">
                    {(idx + 1).toString().padStart(3, "0")}
                  </span>
                  <HighlightedEmail value={v} animate={pos < PAGE && !filterActive} query={query} />
                </div>
                <CopyButton text={full} />
              </li>
            );
          })}
        </ol>
      )}

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
