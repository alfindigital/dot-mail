import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  countVariants,
  generateDotVariants,
  generatePlusVariants,
  parseTags,
  validateUsername,
} from "@/lib/dot-variants";
import { useT } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export type GenMode = "dots" | "plus";

export interface GenerateResult {
  mode: GenMode;
  username: string;
  variants: string[];
}

interface Props {
  onGenerate: (result: GenerateResult) => void;
  externalValue?: string;
}

const EXAMPLES = ["johndoe", "satu", "andi", "budi.santoso"];

function useCountUp(target: number, duration = 400) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced-motion: jump straight to the value.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [target, duration]);

  return value;
}

export function GeneratorCard({ onGenerate, externalValue }: Props) {
  const t = useT();
  const [mode, setMode] = useState<GenMode>("dots");
  const [value, setValue] = useState("");
  const [tags, setTags] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
      setMode("dots");
    }
  }, [externalValue]);

  const validation = useMemo(() => validateUsername(value), [value]);
  const parsedTags = useMemo(() => parseTags(tags), [tags]);

  const dotTotal = validation.valid ? countVariants(validation.username) : 0;
  const animatedTotal = useCountUp(dotTotal);

  function runGenerate(raw: string, m: GenMode, rawTags: string) {
    const result = validateUsername(raw);
    if (!result.valid) return;
    if (m === "dots") {
      onGenerate({
        mode: "dots",
        username: result.username,
        variants: generateDotVariants(result.username),
      });
    } else {
      const list = parseTags(rawTags);
      if (list.length === 0) return;
      onGenerate({
        mode: "plus",
        username: result.username,
        variants: generatePlusVariants(result.username, list),
      });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    // Read latest value from DOM to handle autofill / password managers.
    const raw = inputRef.current?.value ?? value;
    const normalized = raw.trim().toLowerCase();
    if (normalized !== value) setValue(normalized);
    runGenerate(raw, mode, tags);
  }

  function pickExample(ex: string) {
    setValue(ex);
    setMode("dots");
    setTouched(true);
    runGenerate(ex, "dots", tags);
  }

  const showError = (touched || value.length > 0) && !validation.valid;
  const errorMsg = !validation.valid ? t.errors[validation.code] : "";
  const plusEmpty = mode === "plus" && touched && validation.valid && parsedTags.length === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full" data-generator-form>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
        {/* Mode tabs */}
        <div
          role="tablist"
          aria-label="Mode"
          className="mb-4 inline-flex rounded-xl border border-border bg-muted/40 p-1 text-sm"
        >
          {(["dots", "plus"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3.5 py-1.5 font-medium transition ${
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "dots" ? t.modeDots : t.modePlus}
            </button>
          ))}
        </div>

        <label htmlFor="username" className="sr-only">
          {t.inputLabel}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-stretch rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
            <Input
              id="username"
              ref={inputRef}
              data-username-input
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value.toLowerCase())}
              onBlur={() => setTouched(true)}
              placeholder={t.placeholder}
              className="border-0 bg-transparent focus-visible:ring-0 text-base h-12 px-4"
            />
            <span className="flex items-center pr-4 text-muted-foreground font-mono text-xs sm:text-sm select-none">
              @gmail.com
            </span>
          </div>
          <Button type="submit" size="lg" className="h-12 px-6 rounded-xl">
            {t.generate}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Plus-mode tag input */}
        {mode === "plus" && (
          <div className="mt-3">
            <label htmlFor="plus-tags" className="sr-only">
              {t.plusTagPlaceholder}
            </label>
            <Input
              id="plus-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t.plusTagPlaceholder}
              className="h-11 rounded-xl text-base"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">{t.plusHint}</p>
          </div>
        )}

        {/* Example chips (dot mode only) */}
        {mode === "dots" && value.length === 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t.tryLabel}</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => pickExample(ex)}
                className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-foreground hover:border-accent/50 hover:text-accent transition"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 min-h-[1.25rem] text-sm">
          {showError ? (
            <span className="text-destructive">{errorMsg}</span>
          ) : plusEmpty ? (
            <span className="text-destructive">{t.plusEmptyError}</span>
          ) : validation.valid && mode === "dots" ? (
            <div className="flex items-end gap-3 rounded-xl bg-muted/40 px-4 py-3">
              <span className="font-serif text-3xl sm:text-4xl leading-none text-foreground tabular-nums">
                {animatedTotal.toLocaleString(t.lang === "id" ? "id-ID" : "en-US")}
              </span>
              <div className="flex flex-col leading-tight pb-0.5">
                <span className="text-sm text-foreground">{t.combosReady}</span>
                <span className="text-xs text-muted-foreground">
                  {t.fromChars(validation.username.length)}
                </span>
              </div>
            </div>
          ) : validation.valid && mode === "plus" && parsedTags.length > 0 ? (
            <div className="flex items-end gap-3 rounded-xl bg-muted/40 px-4 py-3">
              <span className="font-serif text-3xl sm:text-4xl leading-none text-foreground tabular-nums">
                {parsedTags.length.toLocaleString(t.lang === "id" ? "id-ID" : "en-US")}
              </span>
              <div className="flex flex-col leading-tight pb-0.5">
                <span className="text-sm text-foreground">{t.aliasReady(parsedTags.length)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}
