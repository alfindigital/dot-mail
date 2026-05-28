import { useMemo, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countVariants, validateUsername } from "@/lib/dot-variants";
import { ArrowRight } from "lucide-react";

interface Props {
  onGenerate: (username: string) => void;
  isGenerating?: boolean;
}

export function GeneratorCard({ onGenerate, isGenerating }: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const validation = useMemo(() => validateUsername(value), [value]);
  const total = validation.valid ? countVariants(validation.username) : 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (validation.valid) onGenerate(validation.username);
  }

  const showError = touched && !validation.valid && value.length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
        <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
          Alamat Gmail kamu
        </label>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-stretch rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
            <Input
              id="username"
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
              <span className="text-foreground font-medium">
                {total.toLocaleString("id-ID")}
              </span>{" "}
              kombinasi
            </span>
          ) : (
            <span className="text-muted-foreground">
              Tanpa <span className="font-mono">@gmail.com</span>, hanya huruf & angka.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
