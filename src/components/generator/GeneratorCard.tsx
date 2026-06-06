import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countVariants, validateUsername } from "@/lib/dot-variants";
import { ArrowRight } from "lucide-react";

interface Props {
  onGenerate: (username: string) => void;
  isGenerating?: boolean;
  externalValue?: string;
  
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
    // Read latest value from DOM to handle autofill / password managers
    // that bypass React's onChange events.
    const raw = inputRef.current?.value ?? value;
    const normalized = raw.trim().toLowerCase();
    if (normalized !== value) setValue(normalized);
    const result = validateUsername(raw);
    if (result.valid) onGenerate(result.username);
  }

  const showError = (touched || value.length > 0) && !validation.valid;

  return (
    <form onSubmit={handleSubmit} className="w-full" data-generator-form>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
        <label htmlFor="username" className="sr-only">
          Alamat Gmail kamu
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
            disabled={isGenerating}
            className="h-12 px-6 rounded-xl"
          >
            {isGenerating ? "Membuat…" : "Generate"}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-2 sm:hidden text-xs text-muted-foreground">
          {value.length > 0 ? (
            <>
              akan jadi:{" "}
              <span className="font-mono text-foreground">{value}@gmail.com</span>
            </>
          ) : (
            "Tanpa @gmail.com, kami tambahkan otomatis."
          )}
        </div>

        <div className="mt-3 min-h-[1.25rem] text-sm">
          {showError ? (
            <span className="text-destructive">{(validation as { error: string }).error}</span>
          ) : validation.valid ? (
            <div className="flex items-end gap-3 rounded-xl bg-muted/40 px-4 py-3">
              <span className="font-serif text-3xl sm:text-4xl leading-none text-foreground tabular-nums">
                {animatedTotal.toLocaleString("id-ID")}
              </span>
              <div className="flex flex-col leading-tight pb-0.5">
                <span className="text-sm text-foreground">kombinasi siap dibuat</span>
                <span className="text-xs text-muted-foreground">dari {validation.username.length} karakter</span>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </form>
  );
}
