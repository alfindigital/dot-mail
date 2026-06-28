import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { dotCount } from "@/lib/dot-variants";
import { useT } from "@/lib/i18n";
import { Check, Copy, Download, ListChecks, Search, Tag, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
  mode: "dots" | "plus";
}

// Above this many rows we switch to virtualized rendering.
const VIRTUALIZE_THRESHOLD = 60;
const ROW_HEIGHT_ESTIMATE = 52;

/** Color the dots and the +tag segment; expose the full email to AT. */
function HighlightedEmail({ value }: { value: string }) {
  const plusIdx = value.indexOf("+");
  const base = plusIdx === -1 ? value : value.slice(0, plusIdx);
  const plus = plusIdx === -1 ? "" : value.slice(plusIdx);
  const baseParts = base.split(/(\.)/).filter((p) => p.length > 0);
  return (
    <span className="font-mono text-sm break-all">
      <span aria-hidden="true">
        {baseParts.map((p, i) =>
          p === "." ? (
            <span key={i} className="text-accent font-bold">
              .
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
        {plus && <span className="text-accent font-semibold">{plus}</span>}
        <span className="text-muted-foreground">@gmail.com</span>
      </span>
      <span className="sr-only">{value}@gmail.com</span>
    </span>
  );
}

async function safeCopy(text: string, successMsg: string, failMsg: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg);
  } catch {
    toast.error(failMsg);
  }
}

function CopyButton({
  text,
  ariaLabel,
  failMsg,
}: {
  text: string;
  ariaLabel: string;
  failMsg: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast.error(failMsg);
        }
      }}
      className="opacity-60 sm:opacity-40 sm:group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition rounded-md p-1.5 hover:bg-muted text-muted-foreground shrink-0"
    >
      {copied ? <Check className="size-4 text-accent copy-pop" /> : <Copy className="size-4" />}
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

function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

interface RowProps {
  v: string;
  idx: number;
  isSelected: boolean;
  label?: string;
  selectAria: string;
  copyAria: string;
  copyFail: string;
  onToggle: (v: string) => void;
  withBorderTop: boolean;
}

function Row({
  v,
  idx,
  isSelected,
  label,
  selectAria,
  copyAria,
  copyFail,
  onToggle,
  withBorderTop,
}: RowProps) {
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
      role="button"
      aria-pressed={isSelected}
      aria-label={selectAria}
      tabIndex={0}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(v)}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          aria-hidden="true"
        />
        <span className="text-xs text-muted-foreground tabular-nums w-12 shrink-0">
          {(idx + 1).toString().padStart(3, "0")}
        </span>
        <div className="min-w-0">
          <HighlightedEmail value={v} />
          {label && (
            <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent align-middle">
              {label}
            </span>
          )}
        </div>
      </div>
      <CopyButton text={full} ariaLabel={copyAria} failMsg={copyFail} />
    </div>
  );
}

export function ResultsList({ variants, username, mode }: Props) {
  const t = useT();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [labelDraft, setLabelDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Reset when a new set is generated.
  useEffect(() => {
    setSelected(new Set());
    setLabels({});
    setQuery("");
    setLabelDraft("");
  }, [username, variants, mode]);

  const order = useMemo(() => {
    const m = new Map<string, number>();
    variants.forEach((v, i) => m.set(v, i));
    return m;
  }, [variants]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return variants;
    return variants.filter(
      (v) => `${v}@gmail.com`.includes(q) || (labels[v] ?? "").toLowerCase().includes(q),
    );
  }, [variants, query, labels]);

  const shouldVirtualize = filtered.length > VIRTUALIZE_THRESHOLD;

  const virtualizer = useWindowVirtualizer({
    count: filtered.length,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: 8,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    getItemKey: (i) => filtered[i],
  });

  useEffect(() => {
    virtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((v) => selected.has(v));

  function toggleAll() {
    const next = new Set(selected);
    if (allFilteredSelected) filtered.forEach((v) => next.delete(v));
    else filtered.forEach((v) => next.add(v));
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

  function emailsFor(list: string[]): string {
    return list
      .slice()
      .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .map((v) => `${v}@gmail.com`)
      .join("\n");
  }

  function copyAll() {
    return safeCopy(emailsFor(variants), t.copiedN(variants.length), t.copyFailed);
  }
  function copyFiltered() {
    return safeCopy(emailsFor(filtered), t.copiedN(filtered.length), t.copyFailed);
  }
  function copySelected() {
    return safeCopy(emailsFor([...selected]), t.copiedSelected(selected.size), t.copyFailed);
  }
  function smartCopy() {
    if (selected.size > 0) return copySelected();
    if (filtered.length !== variants.length) return copyFiltered();
    return copyAll();
  }

  function applyLabel() {
    const value = labelDraft.trim();
    if (!value || selected.size === 0) return;
    setLabels((prev) => {
      const next = { ...prev };
      selected.forEach((v) => (next[v] = value));
      return next;
    });
    toast.success(t.labelApplied(selected.size));
    setLabelDraft("");
  }

  function clearLabels() {
    setLabels({});
  }

  function downloadCsv() {
    const lines = ["email,label,dots"];
    for (const v of variants) {
      lines.push(`${v}@gmail.com,${csvCell(labels[v] ?? "")},${dotCount(v)}`);
    }
    download(`dotmail-${username}.csv`, lines.join("\n"), "text/csv");
  }
  function downloadTxt() {
    download(`dotmail-${username}.txt`, emailsFor(variants), "text/plain");
  }

  // Keyboard shortcuts scoped to the results.
  useEffect(() => {
    if (variants.length === 0) return;
    function isTyping(el: EventTarget | null) {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    }
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        smartCopy();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleAll();
        return;
      }
      if (e.key === "Escape" && e.target === searchRef.current && query) {
        e.preventDefault();
        setQuery("");
      }
      void isTyping;
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, selected, filtered, query]);

  if (variants.length === 0) return null;

  const hasLabels = Object.keys(labels).length > 0;
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const offsetTop = listRef.current?.offsetTop ?? 0;

  return (
    <section className="mt-8" data-results-section>
      <div className="sticky top-0 z-10 -mx-5 sm:-mx-8 px-5 sm:px-8 py-3 bg-background/85 backdrop-blur border-b border-border/60 mb-4 space-y-3">
        <header className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground whitespace-nowrap">
              {t.resultsCount(filtered.length)}
            </h2>
            {selected.size > 0 && (
              <Button
                onClick={copySelected}
                variant="default"
                className="rounded-xl h-10 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Copy className="size-4" />
                {t.copySelected} ({selected.size.toLocaleString()})
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={toggleAll}
              variant={allFilteredSelected ? "default" : "outline"}
              className="rounded-xl h-10 w-10 p-0"
              title={allFilteredSelected ? t.deselectAll : t.selectAll}
              aria-label={allFilteredSelected ? t.deselectAll : t.selectAll}
            >
              <ListChecks className="size-4" />
            </Button>
            <Button
              onClick={copyAll}
              variant="outline"
              className="rounded-xl h-10 w-10 p-0"
              title={t.copyAll}
              aria-label={t.copyAll}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              onClick={downloadCsv}
              variant="outline"
              className="rounded-xl h-10 w-10 p-0"
              title={t.downloadCsv}
              aria-label={t.downloadCsv}
            >
              <Download className="size-4" />
            </Button>
          </div>
        </header>


        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-10 rounded-xl pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Labeling toolbar (only when something is selected) */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            <Input
              value={labelDraft}
              onChange={(e) => setLabelDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLabel();
                }
              }}
              placeholder={t.labelPlaceholder}
              aria-label={t.labelSelected}
              className="h-9 rounded-lg flex-1 min-w-[10rem]"
            />
            <Button onClick={applyLabel} variant="default" className="h-9 rounded-lg">
              {t.applyLabel}
            </Button>
            {hasLabels && (
              <Button onClick={clearLabels} variant="outline" className="h-9 rounded-lg">
                {t.clearLabels}
              </Button>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          {t.noMatch}
        </div>
      ) : shouldVirtualize ? (
        <div
          ref={listRef}
          className="rounded-2xl border border-border bg-card overflow-hidden"
          role="list"
        >
          <div style={{ height: `${totalSize}px`, position: "relative", width: "100%" }}>
            {virtualItems.map((vi) => {
              const v = filtered[vi.index];
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
                  role="listitem"
                >
                  <Row
                    v={v}
                    idx={vi.index}
                    isSelected={selected.has(v)}
                    label={labels[v]}
                    selectAria={t.selectAria(`${v}@gmail.com`)}
                    copyAria={t.copyAria}
                    copyFail={t.copyFailed}
                    onToggle={toggleOne}
                    withBorderTop={vi.index > 0}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={listRef}
          className="rounded-2xl border border-border bg-card overflow-hidden"
          role="list"
        >
          {filtered.map((v, pos) => (
            <div key={v} role="listitem">
              <Row
                v={v}
                idx={pos}
                isSelected={selected.has(v)}
                label={labels[v]}
                selectAria={t.selectAria(`${v}@gmail.com`)}
                copyAria={t.copyAria}
                copyFail={t.copyFailed}
                onToggle={toggleOne}
                withBorderTop={pos > 0}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
