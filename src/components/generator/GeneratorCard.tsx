import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countVariants, validateUsername } from "@/lib/dot-variants";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface Props {
  onGenerate: (username: string) => void;
  isGenerating?: boolean;
  externalValue?: string;
  recentVersion?: number;
}

function useCountUp(target: number, duration = 400) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
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

export function GeneratorCard({ onGenerate, isGenerating, externalValue }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue);
  }, [externalValue]);

  const validation = useMemo(() => validateUsername(value), [value]);
  const total = validation.valid ? countVariants(validation.username) : 0;
  const animatedTotal = useCountUp(total);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (validation.valid) onGenerate(validation.username);
  }

  const showError = touched && !validation.valid && value.length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full" data-generator-form>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
            Alamat Gmail kamu
          </label>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            100% di browser
          </span>
        </div>
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
              placeholder="contoh: satu"
              className="border-0 bg-transparent focus-visible:ring-0 text-base h-12 px-4"
            />
            <span className="hidden sm:flex items-center pr-4 text-muted-foreground font-mono text-sm select-none">
              @gmail.com
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!validation.valid || isGenerating}
            className="h-12 px-6 rounded-xl"
          >
            {isGenerating ? "Membuat…" : "Generate"}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-3 min-h-[1.25rem] text-sm">
          {showError ? (
            <span className="text-destructive">{(validation as { error: string }).error}</span>
          ) : validation.valid ? (
            <span className="text-muted-foreground">
              {validation.username.length} karakter ·{" "}
              <span className="text-foreground font-medium tabular-nums">
                {animatedTotal.toLocaleString("id-ID")}
              </span>{" "}
              kombinasi
            </span>
          ) : (
            <span className="text-muted-foreground">
              Tanpa <span className="font-mono">@gmail.com</span> — kami menambahkannya otomatis.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
