import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  { title: "1. Ketik username", desc: "sebelum @gmail.com." },
  { title: "2. Generate", desc: "Langsung keluar semua kombinasi." },
  { title: "3. Salin & pakai", desc: "Salin atau unduh .txt/.csv." },
];

const faqs = [
  {
    q: "Apa itu Gmail dot trick?",
    a: "Gmail dot trick adalah fitur bawaan Gmail yang mengabaikan titik (.) di bagian username sebuah alamat. Jadi s.atu@gmail.com, sa.tu@gmail.com, dan satu@gmail.com semuanya masuk ke inbox yang sama. DotMail menghasilkan seluruh kombinasi titik dari satu username sekaligus.",
  },
  {
    q: "Legal?",
    a: "Iya. Ini fitur bawaan Gmail. Google nggak peduli titik di username, jadi semua variasi tetap masuk inbox yang sama. Bukan hack.",
  },
  {
    q: "Akun saya bisa diblokir?",
    a: "Kalau dipakai normal, aman-aman aja. Risikonya cuma kalau disalahgunain buat spam atau daftar masif yang melanggar aturan layanan lain.",
  },
  {
    q: "Data simpan di mana?",
    a: "Semua diproses di browser kamu sendiri. Nggak ada server, nggak ada database, nggak ada yang ngintip input.",
  },
  {
    q: "Bisa buat apa aja?",
    a: "Filter email per layanan, ngecek siapa yang bocorin email kamu, atau kelola banyak akun dari satu inbox.",
  },
  {
    q: "Shortcut keyboard apa aja yang bisa dipakai?",
    a: "Ctrl+K untuk fokus ke kolom cari. Ctrl+Shift+A untuk pilih / batal pilih semua hasil tersaring. Ctrl+Shift+C untuk salin pintar (pilihan > tersaring > semua). Esc untuk bersihkan pencarian saat sedang mengetik di kolom cari.",
  },
];

export function InfoButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Info dan bantuan"
          className="rounded-full"
        >
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Info & Bantuan</DialogTitle>
        </DialogHeader>

        <section className="mt-2">
          <h3 className="font-serif text-lg text-foreground mb-3">Cara Pakai</h3>
          <div className="grid grid-cols-1 gap-2">
            {steps.map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <h4 className="font-serif text-base text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-serif text-lg text-foreground mb-3">Pertanyaan</h3>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-0 px-4">
                <AccordionTrigger className="text-left text-sm font-serif font-medium hover:no-underline py-3">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-3">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </DialogContent>
    </Dialog>
  );
}
