import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Check, Copy, Download, ListChecks } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
}

// Threshold above which we switch to virtualized rendering.
const VIRTUALIZE_THRESHOLD = 100;
// Estimated row height; the virtualizer measures the real one after mount.
const ROW_HEIGHT_ESTIMATE = 52;
// Items shown per batch with "Load more".
const PAGE_SIZE = 30;

function dotCount(s: string) {
  let c = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === ".") c++;
  return c;
}

function DotEmail({ value }: { value: string }) {
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

async function safeCopy(text: string, successMsg: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg);
  } catch {
    toast.error("Gagal menyalin - periksa izin browser");
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Salin"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Disalin", { duration: 1000 });
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast.error("Gagal menyalin - periksa izin browser");
        }
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
  onToggle: (v: string) => void;
  withBorderTop: boolean;
}

function Row({ v, idx, isSelected, onToggle, withBorderTop }: RowProps) {
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(v);
        }
      }}
      role="listitem"
      tabIndex={0}
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
        <DotEmail value={v} />
      </div>
      <CopyButton text={full} />
    </div>
  );
}

export function ResultsList({ variants, username }: Props) {
  // Selection keyed by variant string.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset on new generation
  useEffect(() => {
    setSelected(new Set());
    setVisibleCount(PAGE_SIZE);
  }, [username, variants]);

  const displayed = useMemo(
    () => variants.slice(0, visibleCount).map((v, i) => ({ v, idx: i })),
    [variants, visibleCount],
  );
  const hasMore = visibleCount < variants.length;
  const shouldVirtualize = displayed.length > VIRTUALIZE_THRESHOLD;

  // Window virtualizer — uses page scroll, preserves sticky header.
  const virtualizer = useWindowVirtualizer({
    count: displayed.length,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 8,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    getItemKey: (i) => displayed[i].v,
  });

  useEffect(() => {
    virtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  function toggleAll() {
    const allSelected =
      variants.length > 0 && variants.every((v) => selected.has(v));
    const next = new Set(selected);
    if (allSelected) {
      variants.forEach((v) => next.delete(v));
    } else {
      variants.forEach((v) => next.add(v));
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

  async function copyAll() {
    const all = variants.map((v) => `${v}@gmail.com`).join("\n");
    await safeCopy(all, `Disalin ${variants.length.toLocaleString("id-ID")} email`);
  }

  async function copySelected() {
    const order = new Map<string, number>();
    variants.forEach((v, i) => order.set(v, i));
    const list = Array.from(selected)
      .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .map((v) => `${v}@gmail.com`)
      .join("\n");
    await safeCopy(list, `Disalin ${selected.size.toLocaleString("id-ID")} email terpilih`);
  }

  async function smartCopy() {
    if (selected.size > 0) return copySelected();
    return copyAll();
  }

  function downloadCsv() {
    const lines = ["email,dots"];
    for (const v of variants) {
      lines.push(`${v}@gmail.com,${dotCount(v)}`);
    }
    download(`dotmail-${username}.csv`, lines.join("\n"), "text/csv");
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (variants.length === 0) return;

    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl+Shift+C → smart copy (selection > all)
      if (mod && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        smartCopy();
        return;
      }

      // Cmd/Ctrl+Shift+A → select / deselect all
      if (mod && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleAll();
        return;
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, selected]);

  if (variants.length === 0) return null;

  const allSelected =
    variants.length > 0 && variants.every((v) => selected.has(v));

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const offsetTop = listRef.current?.offsetTop ?? 0;

  return (
    <section className="mt-8" data-results-section>
      <div className="sticky top-0 z-10 -mx-5 sm:-mx-8 px-5 sm:px-8 py-3 bg-background/85 backdrop-blur border-b border-border/60 mb-4">
        <header className="flex flex-row items-center justify-between gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground whitespace-nowrap">
            {variants.length.toLocaleString("id-ID")} variasi
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={toggleAll}
              variant={allSelected ? "default" : "outline"}
              className="rounded-xl h-10 w-10 p-0"
              title={allSelected ? "Batal pilih semua" : "Pilih semua"}
              aria-label={allSelected ? "Batal pilih semua" : "Pilih semua"}
            >
              <ListChecks className="size-4" />
            </Button>
            {selected.size > 0 && (
              <Button
                onClick={copySelected}
                variant="default"
                className="rounded-xl h-10 flex-1 sm:flex-none"
                title={`Salin terpilih (${selected.size.toLocaleString("id-ID")})`}
              >
                <Copy className="size-4" />
                Salin
              </Button>
            )}
            <Button
              onClick={copyAll}
              variant="outline"
              className="rounded-xl h-10 w-10 p-0"
              title="Salin semua"
              aria-label="Salin semua"
            >
              <Copy className="size-4" />
            </Button>
            <Button
              onClick={downloadCsv}
              variant="outline"
              className="rounded-xl h-10 w-10 p-0"
              title="Unduh sebagai .csv"
              aria-label="Unduh sebagai .csv"
            >
              <Download className="size-4" />
            </Button>
          </div>
        </header>
      </div>

      {shouldVirtualize ? (
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
              const item = displayed[vi.index];
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
          {displayed.map((item, pos) => (
            <Row
              key={item.v}
              v={item.v}
              idx={item.idx}
              isSelected={selected.has(item.v)}
              onToggle={toggleOne}
              withBorderTop={pos > 0}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            className="rounded-xl h-10"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Muat lebih banyak
          </Button>
        </div>
      )}
    </section>
  );
}
