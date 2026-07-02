import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { dotCount } from "@/lib/dot-variants";
import { useT } from "@/lib/i18n";
import { setLabels as persistLabels } from "@/lib/recent-usernames";
import { Check, Copy, Download, Filter, Share2, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  variants: string[];
  username: string;
  initialLabels?: Record<string, string>;
}

const PAGE_SIZE = 20;

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
            <span key={i} className="text-accent font-bold">.</span>
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

function CopyButton({ text, ariaLabel, failMsg }: { text: string; ariaLabel: string; failMsg: string }) {
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

export function ResultsList({ variants, username, initialLabels }: Props) {
  const t = useT();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [labels, setLabelsState] = useState<Record<string, string>>(initialLabels ?? {});
  const [labelDraft, setLabelDraft] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const firstRender = useRef(true);

  useEffect(() => {
    setSelected(new Set());
    setLabelsState(initialLabels ?? {});
    setLabelDraft("");
    setVisibleCount(PAGE_SIZE);
  }, [username, variants, initialLabels]);

  // Persist labels to history (skip first mount echo).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    persistLabels(username, labels);
  }, [labels, username]);

  const visible = useMemo(() => variants.slice(0, visibleCount), [variants, visibleCount]);


  function toggleOne(v: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }

  function emailsFor(list: string[]): string {
    return list.map((v) => `${v}@gmail.com`).join("\n");
  }

  function copyAll() {
    return safeCopy(emailsFor(variants), t.copiedN(variants.length), t.copyFailed);
  }

  function copyFilterQuery() {
    const list = selected.size > 0 ? [...selected] : variants;
    const query = `to:(${list.map((v) => `${v}@gmail.com`).join(" OR ")})`;
    return safeCopy(query, t.filterCopied, t.copyFailed);
  }

  function shareLink() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/?u=${encodeURIComponent(username)}`;
    return safeCopy(url, t.shareCopied, t.copyFailed);
  }

  function applyLabel() {
    const value = labelDraft.trim();
    if (!value || selected.size === 0) return;
    setLabelsState((prev) => {
      const next = { ...prev };
      selected.forEach((v) => (next[v] = value));
      return next;
    });
    toast.success(t.labelApplied(selected.size));
    setLabelDraft("");
  }

  function clearLabels() {
    setLabelsState({});
  }

  function downloadCsv() {
    const lines = ["email,label,dots"];
    for (const v of variants) {
      lines.push(`${v}@gmail.com,${csvCell(labels[v] ?? "")},${dotCount(v)}`);
    }
    download(`dotmail-${username}.csv`, lines.join("\n"), "text/csv");
  }

  if (variants.length === 0) return null;

  const hasLabels = Object.keys(labels).length > 0;
  const hasMore = visibleCount < variants.length;

  return (
    <section className="mt-8" data-results-section>
      <div className="mb-4 flex flex-row items-center justify-between gap-3">
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground whitespace-nowrap">
          {t.resultsCount(variants.length)}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {selected.size > 0 && (
            <Button
              onClick={() =>
                safeCopy(
                  emailsFor([...selected]),
                  t.copiedSelected(selected.size),
                  t.copyFailed,
                )
              }
              className="rounded-xl h-10 px-3 bg-accent text-white hover:bg-accent/90"
              title={t.copySelected}
            >
              <Copy className="size-4" />
              <span className="ml-1.5 tabular-nums">{t.copySelected} ({selected.size})</span>
            </Button>
          )}
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
      </div>

      {/* Labeling toolbar (icons only) */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Tag className="size-4 text-muted-foreground shrink-0" />
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
            className="h-10 rounded-lg flex-1 min-w-[10rem]"
          />
          <Button
            onClick={applyLabel}
            className="rounded-lg h-10 w-10 p-0 bg-accent text-white hover:bg-accent/90"
            title={t.applyLabel}
            aria-label={t.applyLabel}
          >
            <Check className="size-4" />
          </Button>
          {hasLabels && (
            <Button
              onClick={clearLabels}
              variant="outline"
              className="rounded-lg h-10 w-10 p-0"
              title={t.clearLabels}
              aria-label={t.clearLabels}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden" role="list">
        {visible.map((v, pos) => {
          const isSelected = selected.has(v);
          const label = labels[v];
          const full = `${v}@gmail.com`;
          return (
            <div
              key={v}
              role="listitem"
              className={`group relative flex items-center justify-between gap-3 px-4 py-3 transition cursor-pointer border-l-2 ${
                pos > 0 ? "border-t border-t-border" : ""
              } ${
                isSelected
                  ? "bg-accent/5 border-l-accent"
                  : "border-l-transparent hover:bg-muted/40 hover:border-l-accent/40"
              }`}
              onClick={() => toggleOne(v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleOne(v);
                }
              }}
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={t.selectAria(full)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleOne(v)}
                  onClick={(e) => e.stopPropagation()}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <HighlightedEmail value={v} />
                  {label && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent align-middle">
                      {label}
                    </span>
                  )}
                </div>
              </div>
              <CopyButton text={full} ariaLabel={t.copyAria} failMsg={t.copyFailed} />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, variants.length))}
            variant="outline"
            className="rounded-xl h-10 px-6"
          >
            {t.loadMore} ({(variants.length - visibleCount).toLocaleString("en-US")})
          </Button>
        </div>
      )}
    </section>
  );
}
