import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, Copy, Download, FileText, Search, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
}

type DotFilter = "all" | "0" | "1-2" | "3-4" | "5+";

const DOT_FILTERS: { key: DotFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "0", label: "Tanpa titik" },
  { key: "1-2", label: "1–2 titik" },
  { key: "3-4", label: "3–4 titik" },
  { key: "5+", label: "5+ titik" },
];

// Threshold above which we switch to virtualized rendering.
const VIRTUALIZE_THRESHOLD = 100;
// Estimated row height; the virtualizer measures the real one after mount.
const ROW_HEIGHT_ESTIMATE = 52;

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

function isTyping(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

function HighlightedEmail({
  value,
  query,
}: {
  value: string;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const matchStart = q ? value.toLowerCase().indexOf(q) : -1;
  const matchEnd = matchStart >= 0 ? matchStart + q.length : -1;

  return (
    <span className="font-mono text-sm break-all">
      {value.split("").map((c, i) => {
        const inMatch = matchStart >= 0 && i >= matchStart && i < matchEnd;
        if (c === ".") {
          return (
            <span
              key={i}
              className={`text-accent font-bold${inMatch ? " bg-accent/20 rounded-sm" : ""}`}
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

interface RowProps {
  v: string;
  idx: number;
  isSelected: boolean;
  query: string;
  onToggle: (v: string) => void;
  withBorderTop: boolean;
}

function Row({ v, idx, isSelected, query, onToggle, withBorderTop }: RowProps) {
  const full = `${v}@gmail.com`;
  return (
    <div
      className={`group relative flex items-center justify-between gap-3 px-4 py-3 transition cursor-pointer border-l-2 ${
        withBorderTop ? "border-t border-t-border" : ""
      } ${
        isSelected
          ? "bg-accent/5 border-l-accent"
          : "border-l-transparent hover:bg-muted/40 hover:border-l-accent/40"
      }`}
      onClick={() => onToggle(v)}
      role="listitem"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(v)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Pilih ${full}`}
        />
        <span className="text-xs text-muted-foreground tabular-nums w-12 shrink-0">
          {(idx + 1).toString().padStart(3, "0")}
        </span>
        <HighlightedEmail value={v} query={query} />
      </div>
      <CopyButton text={full} />
    </div>
  );
}

export function ResultsList({ variants, username }: Props) {
  // Selection keyed by variant string so it survives filtering.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [dotFilter, setDotFilter] = useState<DotFilter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset on new generation
  useEffect(() => {
    setSelected(new Set());
    setQuery("");
    setDotFilter("all");
  }, [username, variants]);

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

  const filterActive = query.trim().length > 0 || dotFilter !== "all";
  const shouldVirtualize = filtered.length > VIRTUALIZE_THRESHOLD;

  // Window virtualizer — uses page scroll, preserves sticky header.
  const virtualizer = useWindowVirtualizer({
    count: filtered.length,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 8,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    getItemKey: (i) => filtered[i].v,
  });

  // Recompute scrollMargin when filter/list re-mounts.
  useEffect(() => {
    virtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dotFilter, variants]);

  function selectAllVisible(rangeStart: number, rangeEnd: number) {
    const next = new Set(selected);
    for (let i = rangeStart; i < rangeEnd; i++) next.add(filtered[i].v);
    setSelected(next);
  }

  function toggleAllFiltered() {
    const allSelected =
      filtered.length > 0 && filtered.every(({ v }) => selected.has(v));
    const next = new Set(selected);
    if (allSelected) {
      filtered.forEach(({ v }) => next.delete(v));
    } else {
      filtered.forEach(({ v }) => next.add(v));
    }
    setSelected(next);
  }

  function toggleOne(v: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
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
    const order = new Map<string, number>();
    variants.forEach((v, i) => order.set(v, i));
    const list = Array.from(selected)
      .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .map((v) => `${v}@gmail.com`)
      .join("\n");
    await navigator.clipboard.writeText(list);
    toast.success(`Disalin ${selected.size.toLocaleString("id-ID")} email terpilih`);
  }

  // Smart copy: selection > filtered > all.
  async function smartCopy() {
    if (selected.size > 0) return copySelected();
    if (filterActive) return copyFiltered();
    return copyAll();
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

  // Keyboard shortcuts
  useEffect(() => {
    if (variants.length === 0) return;

    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+K → focus search
      if (mod && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      // Cmd/Ctrl+Shift+C → smart copy (selection > filtered > all)
      if (mod && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        smartCopy();
        return;
      }

      // Cmd/Ctrl+Shift+A → select / deselect all filtered
      if (mod && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleAllFiltered();
        return;
      }

      // Esc while typing in search → clear & blur
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        e.preventDefault();
        setQuery("");
        searchRef.current?.blur();
        return;
      }

      // Digit 1..5 → toggle dot filter chips (only when not typing)
      if (!isTyping(e.target) && !mod && !e.shiftKey && /^[1-5]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (DOT_FILTERS[idx]) {
          e.preventDefault();
          setDotFilter(DOT_FILTERS[idx].key);
        }
        return;
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, filtered, selected, filterActive, query, dotFilter]);

  if (variants.length === 0) return null;

  const allFilteredSelected =
    filtered.length > 0 && filtered.every(({ v }) => selected.has(v));

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const offsetTop = listRef.current?.offsetTop ?? 0;

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
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pola titik, mis. s.a atau .tu  (⌘K)"
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
          {DOT_FILTERS.map((f, i) => {
            const active = dotFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setDotFilter(f.key)}
                title={`Pintasan: ${i + 1}`}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-muted/30 text-muted-foreground border-border hover:border-accent/50"
                }`}
              >
                <span className="font-mono text-[10px] opacity-60 mr-1">{i + 1}</span>
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
            checked={allFilteredSelected}
            onCheckedChange={toggleAllFiltered}
            aria-label="Pilih semua tersaring"
          />
          <span>
            Pilih semua{filterActive ? " tersaring" : ""} (
            {filtered.length.toLocaleString("id-ID")})
          </span>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="underline hover:text-foreground transition"
            >
              Kosongkan pilihan
            </button>
          )}
          {shouldVirtualize && (
            <span className="hidden sm:inline">Virtual scroll aktif</span>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak ada variasi yang cocok dengan filter saat ini.
          </p>
        </div>
      ) : shouldVirtualize ? (
        <div
          ref={listRef}
          className="rounded-2xl border border-border bg-card overflow-hidden"
          role="list"
        >
          <div
            style={{
              height: `${totalSize}px`,
              position: "relative",
              width: "100%",
            }}
          >
            {virtualItems.map((vi) => {
              const item = filtered[vi.index];
              return (
                <div
                  key={vi.key}
                  data-index={vi.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${vi.start - offsetTop}px)`,
                  }}
                >
                  <Row
                    v={item.v}
                    idx={item.idx}
                    isSelected={selected.has(item.v)}
                    query={query}
                    onToggle={toggleOne}
                    withBorderTop={vi.index > 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Non-virtual fallback for small lists keeps simple DOM.
        <div
          ref={listRef}
          className="rounded-2xl border border-border bg-card overflow-hidden"
          role="list"
        >
          {filtered.map((item, pos) => (
            <Row
              key={item.v}
              v={item.v}
              idx={item.idx}
              isSelected={selected.has(item.v)}
              query={query}
              onToggle={toggleOne}
              withBorderTop={pos > 0}
            />
          ))}
        </div>
      )}

      {/* Shortcut hint */}
      <div className="mt-4 hidden sm:flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span>
          <kbd className="kbd-mini">⌘K</kbd> cari
        </span>
        <span>
          <kbd className="kbd-mini">1</kbd>–<kbd className="kbd-mini">5</kbd> filter
        </span>
        <span>
          <kbd className="kbd-mini">⌘⇧A</kbd> pilih semua tersaring
        </span>
        <span>
          <kbd className="kbd-mini">⌘⇧C</kbd> salin pintar
        </span>
        <span>
          <kbd className="kbd-mini">Esc</kbd> bersihkan cari
        </span>
      </div>
    </section>
  );
}
