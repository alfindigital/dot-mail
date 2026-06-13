# Revisi Validasi Input Username

## Masalah
User dengan email asli seperti `alfin.pbg@gmail.com` ditolak karena regex saat ini melarang titik. Padahal aturan Gmail: username boleh huruf, angka, dan titik — titik hanya diabaikan oleh Gmail (itulah dasar dot-trick ini).

## Aturan Gmail (referensi terbaru)
- Karakter yang diizinkan di username: `a–z`, `0–9`, dan `.` (titik).
- Titik **diabaikan** Gmail (jadi `alfin.pbg` = `alfinpbg` = inbox yang sama).
- Tidak boleh: spasi, simbol lain (`_`, `-`, `+`, dll. di local-part Gmail baru), huruf kapital diperlakukan sama.
- Panjang username Gmail: 6–30 karakter (tanpa hitung titik).

## Perubahan

### 1. `src/lib/dot-variants.ts` — `validateUsername()`
- Terima input yang mengandung titik.
- Normalisasi: `trim().toLowerCase()` lalu **strip semua titik** sebelum validasi panjang & charset.
- Regex baru pada raw input (setelah lowercase/trim): `^[a-z0-9.]+$` — tolak spasi & simbol lain.
- Tolak jika ada titik di awal/akhir atau titik berurutan (`..`) — bukan format Gmail valid; opsional tapi mengikuti aturan Gmail.
- Validasi panjang dilakukan pada string **tanpa titik** (yang dipakai untuk generate):
  - min 2 (untuk dot-trick tetap bermakna), max 15 (batas saat ini agar `2^(n-1)` masih wajar).
- Return `{ valid: true, username }` di mana `username` = versi tanpa titik (jadi `generateDotVariants` dan `countVariants` tetap bekerja apa adanya).

### 2. Pesan error & helper text
- Pesan error charset: `"Hanya huruf a-z, angka 0-9, dan titik. Tanpa spasi atau simbol."`
- Error tambahan untuk pola titik aneh: `"Titik tidak boleh di awal, akhir, atau berurutan."`
- `GeneratorCard.tsx` helper "akan jadi" tetap tampilkan apa yang user ketik (boleh ada titik) — yang dihitung kombinasi tetap berdasar versi tanpa titik.

### 3. `GeneratorCard.tsx` — onChange
- Saat ini: `e.target.value.toLowerCase()`. Tidak diubah (biarkan titik tersimpan di field).
- Tidak mem-force-strip titik di field — supaya user lihat input aslinya. Strip terjadi di `validateUsername`.

## Yang TIDAK diubah
- Algoritma `generateDotVariants` / `countVariants` — sudah benar.
- UI/layout, history, theme.
- Batas panjang 2–15 (tetap, hanya basisnya kini "tanpa titik").

## File yang disentuh
- `src/lib/dot-variants.ts` (validateUsername + 1-2 helper kecil)
- Tidak perlu ubah `GeneratorCard.tsx` kecuali kamu mau, karena pesan error datang dari validator.

## Catatan
Setelah approve, saya juga cek `e2e/faq.spec.ts` apakah ada test yang assert pesan error lama — kalau ada, update assertion-nya.
