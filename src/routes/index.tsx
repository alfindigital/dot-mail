import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { GeneratorCard } from "@/components/generator/GeneratorCard";
import { ResultsList } from "@/components/generator/ResultsList";
import { generateDotVariants } from "@/lib/dot-variants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DotMail — Gmail Dot Trick Generator" },
      {
        name: "description",
        content:
          "Generate semua variasi titik (dot trick) untuk username Gmail kamu. Cepat, elegan, sepenuhnya berjalan di browser.",
      },
      { property: "og:title", content: "DotMail — Gmail Dot Trick Generator" },
      {
        property: "og:description",
        content:
          "Tool gratis untuk menghasilkan seluruh kombinasi titik pada alamat Gmail. Privasi terjaga, tanpa server.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [variants, setVariants] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  function handleGenerate(u: string) {
    setUsername(u);
    setVariants(generateDotVariants(u));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />

      <header className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="font-serif text-xl tracking-tight">DotMail</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">v0.1 · local-only</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-12 sm:pt-20 pb-24">
        <section className="text-center mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Gmail dot trick generator
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] text-foreground">
            Satu inbox.{" "}
            <span className="italic text-accent">Ratusan</span> alamat.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Gmail mengabaikan titik di username — <span className="font-mono">a.lfin</span>,{" "}
            <span className="font-mono">al.fin</span>, dan{" "}
            <span className="font-mono">alfin</span> semua masuk ke inbox yang sama. Buat
            semua variasinya sekaligus.
          </p>
        </section>

        <GeneratorCard onGenerate={handleGenerate} />

        {variants.length > 0 && <ResultsList variants={variants} username={username} />}
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            100% lokal di browser kamu — tidak ada data yang dikirim ke server.
          </p>
          <p className="font-mono text-xs">DotMail · made with care</p>
        </div>
      </footer>
    </div>
  );
}
