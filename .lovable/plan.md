# Plan — Polish DotMail (Fase 1.5)

Sepuluh perubahan terarah, semuanya di frontend/presentation. Tidak ada perubahan algoritma atau struktur data.

## 1. Contoh username generik
- `src/routes/index.tsx` hero copy: ganti contoh `a.lfin / al.fin / alfin` → `s.atu / sa.tu / sat.u / satu`.
- `src/components/generator/GeneratorCard.tsx` placeholder `contoh: alfinjulianto` → `contoh: satu`.

## 2. Hapus eyebrow "Gmail dot trick generator"
- Hilangkan `<p class="uppercase tracking …">Gmail dot trick generator</p>` di hero.

## 3. Warna brand → merah Gmail
Di `src/styles.css`, ganti accent brass jadi merah Gmail (`#EA4335` ≈ `oklch(0.62 0.22 27)`), termasuk:
- `--accent`, `--ring`, `--chart-1` (light + dark)
- Dot logo di header pakai token `bg-accent` (sudah otomatis ikut)
- Italic "Ratusan" di hero pakai `text-accent` (sudah otomatis ikut)

## 4. Logo DotMail merah Gmail
- Header: dot bulat (`size-2.5`) tetap, jadikan logomark: lingkaran kecil merah + wordmark `DotMail` di font yang sama dengan hero (lihat #8). Wordmark pakai `text-foreground`, titik merah pakai `bg-accent`.

## 5. Hapus badge versi / local-only di header
- Buang `v0.1 · local-only` di header kanan.

## 6. Toggle dark / light di pojok kanan atas
- Komponen baru `src/components/layout/ThemeToggle.tsx`:
  - State default = `prefers-color-scheme`.
  - Persist ke `localStorage` (`dotmail-theme`).
  - Toggle class `.dark` pada `<html>`.
  - Icon `Sun` / `Moon` dari lucide, tombol `ghost` ukuran `icon`, rounded-full.
- Slot di header kanan, menggantikan badge versi.

## 7. Hapus kalimat "Buat semua variasinya sekaligus."
- Potong kalimat tersebut di hero subcopy.

## 8. Rephrase label input
- `Username Gmail kamu` → `Alamat Gmail kamu` (lebih natural; kita sudah render suffix `@gmail.com` jadi nuansanya alamat, bukan username).

## 9. Ganti icon Generate
- `Sparkles` → `ArrowRight` (lucide). To-the-point, bukan icon AI/magic cliché. Posisi icon di kanan teks.

## 10. Konsistensi tipografi & komponen
- **Header semua pakai `font-serif`** (Instrument Serif):
  - `h1` hero ✓ (sudah)
  - `h2` "N variasi" ✓ (sudah)
  - Wordmark `DotMail` → tambahkan `font-serif` (saat ini default sans, hanya `tracking-tight`)
- **Body text** semua pakai default `font-sans` Inter (sudah konsisten).
- **Button**: pakai varian shadcn standar (jangan override warna manual).
  - Generate: `<Button>` default (otomatis `bg-primary text-primary-foreground`) — buang `bg-foreground text-background hover:bg-foreground/90`.
  - Salin semua: `<Button variant="outline">` ✓ (sudah).
  - Tampilkan-lagi: `<Button variant="ghost">` ✓ (sudah).
  - Semua tombol pakai `rounded-xl h-10` atau ukuran default; samakan jadi `size="lg"` untuk Generate + Salin semua agar visual seimbang.

## 11. Footer disalin persis dari drawdowncal.lovable.app
Markup target (Indonesia, satu baris, center di mobile):

```
by @alfindigital  |  [globe] [facebook] [youtube] [tiktok] [x] [telegram]
```

Implementasi `src/routes/index.tsx` footer:
- Container: `border-t border-border/60`, inner `mx-auto max-w-3xl px-5 py-6 flex items-center justify-center gap-3 text-sm text-muted-foreground`.
- Teks: `by` + link `@alfindigital` (bold, `text-foreground`, href `https://www.instagram.com/alfindigital`).
- Separator vertikal `|` (`text-border`).
- Row icon (`size-4`, `text-muted-foreground hover:text-accent transition`):
  - Globe → `https://alfindigital.com`
  - Facebook → `https://facebook.com/alfindigital`
  - Youtube → `https://youtube.com/@alfindigital`
  - Tiktok → `https://tiktok.com/@alfindigital`
  - X (Twitter) → `https://x.com/alfindigital`
  - Telegram (`Send` icon lucide) → `https://t.me/alfindigital`
- Hapus dua baris footer lama ("100% lokal…" dan "DotMail · made with care").

## File yang disentuh
- `src/styles.css` — token accent merah Gmail (light + dark)
- `src/routes/index.tsx` — header, hero copy, footer, mount ThemeToggle
- `src/components/generator/GeneratorCard.tsx` — placeholder, label, icon, button styling
- `src/components/layout/ThemeToggle.tsx` — baru

## Yang TIDAK berubah
- Algoritma `dot-variants.ts`, `ResultsList.tsx` interaksi, struktur SEO meta, route tree.

Setelah approve, saya implement langsung tanpa pertanyaan lanjutan.
