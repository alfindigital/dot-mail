# Batch 1 — Quick wins UI/UX

Scope: frontend-only di `routes/index.tsx`, `GeneratorCard.tsx`, `ResultsList.tsx`, dan `styles.css`. Tidak ada backend, dependencies, atau route baru.

## Yang dibangun

### 1. Social proof tipis (index.tsx)
Tambah 1 baris muted di bawah hero, sebelum generator:
"Dipakai buat filter Gmail, testing form, dan kelola multi-akun."
Style: text-xs, muted-foreground, center, dot separator antar use case.

### 2. Helper @gmail.com jelas di mobile (GeneratorCard.tsx)
- Saat ini suffix `@gmail.com` cuma muncul di sm+. Di mobile, kosong.
- Tambah baris preview kecil di bawah input (mobile only, hidden di sm+):
  `akan jadi: namamu@gmail.com` — live update mengikuti `value`, muted, font-mono untuk bagian email.
- Saat input kosong, fallback ke hint: "Tanpa @gmail.com, kami tambahkan otomatis."

### 3. Header hasil lebih scannable (ResultsList.tsx)
Reorganisasi sticky header:
- Kiri: angka + label tetap (sudah ok).
- Kanan: action group dikelompokkan jadi 2 cluster dengan separator tipis:
  - Cluster "Salin": `Salin terpilih` (kalau ada) + `Salin semua`.
  - Cluster "Unduh": `.txt` + `.csv` digabung jadi satu split-style group (border bersama, lebih ringkas).
- Di mobile, action group full-width di baris kedua biar nggak crammed.

### 4. Hover row highlight + quick copy lebih afford (ResultsList.tsx)
- Row sudah ada hover bg + opacity-0 copy button. Tweak:
  - Copy icon: dari `opacity-0` jadi `opacity-30` di idle, `opacity-100` di hover. Lebih ke-discover tanpa berisik.
  - Tambah subtle left border accent (2px) yang muncul di hover/selected biar row terasa "diraih".

### 5. Smooth scroll ke hasil (index.tsx)
Setelah `handleGenerate` jalan dan `variants` ke-set, scroll ke section results dengan offset header. Pakai `requestAnimationFrame` + `scrollIntoView({ behavior: "smooth", block: "start" })`. Skip kalau user sudah di posisi results (cek via `getBoundingClientRect`).

### 6. Micro animasi saat copy (ResultsList.tsx + styles.css)
- `CopyButton`: saat sukses, checkmark dapat scale-spring kecil (scale 0.8 → 1.1 → 1, 250ms). Tambah keyframe `copy-pop` di styles.css.
- Toast tetap, tapi durasi diperpendek jadi 1000ms biar nggak numpuk.

## Files touched

- `src/routes/index.tsx` — social proof line, smooth scroll handler.
- `src/components/generator/GeneratorCard.tsx` — mobile preview helper.
- `src/components/generator/ResultsList.tsx` — header reorg, hover polish, copy animasi.
- `src/styles.css` — keyframe `copy-pop`.

## Out of scope (untuk batch berikutnya)

Batch 2 (1, 4, 8, 14, 19), Batch 3 (11, 13, 15, 22), dan ide lain dari list sebelumnya.

## Catatan

- Semua copy bahasa Indonesia, tone tetap santai.
- Tidak ada em dash (—) di teks user-facing — pakai koma, titik, atau "·".
- Tidak ada dependency baru.