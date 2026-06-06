# Batch 2 — Delight & trust

Scope: frontend-only di `routes/index.tsx` dan `GeneratorCard.tsx`. Tidak ada backend, dependencies, atau route baru.

## Yang dibangun

### 1. Hero lebih "berdiri" (index.tsx)
- Tambah eyebrow kecil di atas H1: `Gratis · Jalan di browser · Tanpa login`. Uppercase tracking-wide, text-xs muted, dot separator.
- Sub-headline diperpendek jadi 1 kalimat tenang: "Gmail nggak peduli titik di username. Semua variasi masuk ke inbox yang sama."
- Contoh `s.atu`, `sa.tu`, `sat.u`, `satu` dipindah jadi chip kecil tepat di atas generator (bukan di hero), biar hero punya nafas.
- Catatan: social-proof line dari batch 1 tetap, tapi digeser jadi tepat di bawah sub-headline (di atas chip examples).

### 2. Footer credibility (index.tsx)
- Tambah micro-section di atas footer (di luar `<main>`, sebelum `<footer>`):
  - Background subtle (`bg-muted/30`), border-t.
  - Grid 3 kolom (stack di mobile): tiap kolom punya lucide icon dalam square rounded, label pendek, dan 1-line desc:
    - `ShieldCheck` — "100% di browser" / "Nggak ada yang dikirim ke server."
    - `Lock` — "Tanpa login" / "Pakai langsung, nggak perlu daftar."
    - `Zap` — "Instan" / "Ribuan kombinasi dihitung di laptopmu."
- Style minimalis: icon size-5, label font-medium, desc text-xs muted.

### 3. Counter dramatis tapi tetap minimalis (GeneratorCard.tsx)
- Saat input valid, area helper text di bawah generator (`mt-3 min-h-[1.25rem]`) ditingkatkan jadi panel kecil:
  - Angka kombinasi font-serif besar (text-3xl) di kiri, tabular-nums, animated count-up (sudah ada).
  - Di kanan/bawah angka: label kecil "kombinasi siap dibuat" + sub-label "dari N karakter".
  - Saat invalid/empty: kembali ke 1-baris error/hint biasa, panel collapse.
- Bikin "wow moment" sebelum klik Generate tanpa loud — angka jadi anchor visual.

### 4. Empty state hasil yang manis (index.tsx)
- Saat belum generate, area bawah generator saat ini cuma punya section "Cara Pakai". Tweak:
  - Tambah hint visual kecil di atas grid Cara Pakai: dashed-border rounded card dengan ikon `Sparkles` muted + teks "Hasil akan muncul di sini setelah kamu generate."
  - Card tinggi modest (py-10), center, full muted style. Saat ada hasil, card disembunyikan otomatis (karena conditional render saat ini).
- "Cara Pakai" tetap di bawah hint card.

### 5. Keyboard hint visible (index.tsx)
- Di pojok footer (kiri atau row tersendiri di atas credit line), tambah baris hint tipis (hidden di mobile, `hidden sm:flex`):
  - Pakai `<kbd>` elements bergaya minimalis (border, rounded, text-xs, font-mono).
  - Format: `Tekan [/] untuk fokus input · [⌘ A] untuk salin semua`.
- Style `<kbd>`: `inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/40 font-mono text-[10px]`.

## Files touched

- `src/routes/index.tsx` — eyebrow hero, sub-headline diperpendek, chip examples, social-proof reposition, trust section, empty-state hint, keyboard hint footer.
- `src/components/generator/GeneratorCard.tsx` — counter panel dramatis.

## Catatan

- Tone tetap santai Bahasa Indonesia.
- Tidak ada em dash (—) di teks user-facing.
- Tidak ada dependency baru. Icon ambil dari lucide-react yang sudah dipakai.
- Vibe minimalis bersih konsisten dengan batch 1.

## Out of scope

Batch 3 (search/filter hasil, pagination upgrade, format toggle, share button), serta ide 3, 5, 7, 9, 16, 17, 21, 23, 24 dari list awal.