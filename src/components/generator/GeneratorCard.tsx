import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  countVariants,
  generateDotVariants,
  validateUsername,
} from "@/lib/dot-variants";
import { useT } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export type GenMode = "dots";

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
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const validation = useMemo(() => validateUsername(value), [value]);

  const dotTotal = validation.valid ? countVariants(validation.username) : 0;
  const animatedTotal = useCountUp(dotTotal);

  function runGenerate(raw: string) {
    const result = validateUsername(raw);
    if (!result.valid) return;
    onGenerate({
      mode: "dots",
      username: result.username,
      variants: generateDotVariants(result.username),
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const raw = inputRef.current?.value ?? value;
    const normalized = raw.trim().toLowerCase();
    if (normalized !== value) setValue(normalized);
    runGenerate(raw);
  }

  function pickExample(ex: string) {
    setValue(ex);
    setTouched(true);
    runGenerate(ex);
  }

  const showError = (touched || value.length > 0) && !validation.valid;
  const errorMsg = !validation.valid ? t.errors[validation.code] : "";

  return (
    <form onSubmit={handleSubmit} className="w-full" data-generator-form>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
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
          <Button type="submit" size="lg" className="h-12 px-6 rounded-xl bg-accent text-white hover:bg-accent/90">
            {t.generate}
            <ArrowRight className="size-4" />
          </Button>
        </div>


        <div className="mt-3 min-h-[1.25rem] text-sm">
          {showError ? (
            <span className="text-destructive">{errorMsg}</span>
          ) : validation.valid ? (
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
          ) : null}
        </div>
      </div>
    </form>
  );
}
