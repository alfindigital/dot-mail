# UI/UX Improvements for DotMail

Scope: frontend-only changes to `GeneratorCard`, `ResultsList`, and `routes/index.tsx`. No backend, no schema, no new routes. Skipping #20 (dynamic OG image) — it needs server-side image generation, out of scope here.

## What gets built

### 1. Multi-select + bulk copy (ResultsList)
- Add a checkbox column on each row.
- Header gets a "Pilih semua di halaman" master checkbox + a "Salin terpilih (N)" button that only appears when N > 0.
- Selection state stored in a `Set<number>` keyed by variant index. Resets when `username` changes.

### 2. Download .txt / .csv (ResultsList header)
- Two buttons next to "Salin semua": **Unduh .txt** and **Unduh .csv**.
- `.txt`: one email per line. `.csv`: header `email,dots` + rows. File name: `dotmail-<username>.txt|csv`.
- Trigger via Blob + `URL.createObjectURL` + temporary `<a download>`.

### 3. Toast feedback per copy item (ResultsList)
- `CopyButton` already shows a check icon; also fire `toast.success("Disalin")` so feedback matches "Salin semua".

### 6. Recent usernames (GeneratorCard)
- Persist last 5 valid usernames to `localStorage` key `dotmail:recent`.
- Render as small chips under the input. Click chip → fill input + auto-submit. Include a small "×" per chip to remove.

### 7. Keyboard shortcuts (index.tsx)
- Global listener: `/` focuses the username input (ignored when already typing in input/textarea).
- `Cmd/Ctrl+A` while results are visible AND focus is outside an input → copy all (preventDefault).

### 9. Animated count-up (GeneratorCard)
- Replace the static combination number with a count-up animation (~400ms ease-out) using `requestAnimationFrame`. Animates from previous value to new value whenever `total` changes.

### 10. "Bagaimana cara pakai?" section (index.tsx)
- 3-step row below generator (only shown when no results yet, to avoid pushing results down):
  1. Ketik username Gmail
  2. Klik Generate
  3. Salin & gunakan
- Each step: lucide icon in a rounded square + short label + 1-line description.

### 11. FAQ accordion (index.tsx)
- Use existing `@/components/ui/accordion`. Placed near the bottom of `<main>`.
- 4 items: legality, Gmail blocking, data privacy, use cases. Static copy in Indonesian.
- Good for SEO — rendered as real DOM, includes `<h2>` heading.

### 12. Privacy badge (GeneratorCard)
- Small pill above the input: shield icon + "100% di browser — tidak ada data dikirim". Muted styling, not loud.

### 14. Highlight dot stagger animation (ResultsList)
- When results first render (and on new generation), each row's dots fade-in with a small staggered delay. Implement with a CSS keyframe + `animation-delay: calc(var(--i) * 8ms)` capped at ~400ms total so long lists don't lag. Only animate the first page (200 rows).

### 15. Sticky results header (ResultsList)
- Wrap the header (`Salin semua`, multi-select bar, download buttons) in a `sticky top-0 z-10 bg-background/80 backdrop-blur` container so it stays visible on scroll.

### 16. Mobile @gmail.com helper (GeneratorCard)
- Keep the inline suffix hidden on mobile (avoids layout cramping), but add a helper line under the input: "Tanpa @gmail.com — kami menambahkannya otomatis." Visible on all sizes; replaces the current placeholder hint when the field is empty.

## Files touched

- `src/components/generator/GeneratorCard.tsx` — privacy badge, recent chips, animated counter, updated helper text.
- `src/components/generator/ResultsList.tsx` — checkboxes, bulk copy, download buttons, per-item toast, sticky header, stagger animation.
- `src/routes/index.tsx` — keyboard shortcuts, "Bagaimana cara pakai?" section, FAQ accordion, wire `recent` callback.
- `src/styles.css` — add `@keyframes dot-stagger-in` utility class.
- New small util: `src/lib/recent-usernames.ts` for localStorage get/add/remove (keeps component clean).

## Out of scope

- #20 OG image dinamis (needs server-side image generation route — separate task if you want it).
- Sort/filter/search on results, empty-state illustration, share button, focus-ring/aria-live polish — not in this batch (you can request them next).

## Notes

- All copy in Indonesian to match existing tone.
- No changes to `dot-variants.ts` logic.
- No new dependencies.
