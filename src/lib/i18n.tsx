import { createContext, useContext, type ReactNode } from "react";
import type { ValidationError } from "@/lib/dot-variants";

export type Lang = "id" | "en";

export interface FaqItem {
  q: string;
  a: string;
}

export interface UseCase {
  title: string;
  desc: string;
}

export interface Dict {
  lang: Lang;
  htmlLang: string;
  // Head / SEO
  metaTitle: string;
  metaDescription: string;
  ogImageAlt: string;
  // Header
  brandTagline: string;
  // Hero
  heroLine1: string;
  heroEm: string;
  heroLine2: string;
  heroSubtitle: string;
  trustBadge: string;
  tryLabel: string;
  // Generator
  modeDots: string;
  modePlus: string;
  inputLabel: string;
  placeholder: string;
  plusTagPlaceholder: string;
  plusHint: string;
  generate: string;
  generating: string;
  combosReady: string;
  fromChars: (n: number) => string;
  aliasReady: (n: number) => string;
  errors: Record<ValidationError, string>;
  plusEmptyError: string;
  // Results
  resultsCount: (n: number) => string;
  searchPlaceholder: string;
  selectAll: string;
  deselectAll: string;
  copySelected: string;
  copyAll: string;
  downloadCsv: string;
  downloadTxt: string;
  labelSelected: string;
  applyLabel: string;
  labelPlaceholder: string;
  clearLabels: string;
  noMatch: string;
  emptyPlaceholder: string;
  loadMore: string;
  historyBack: string;
  // toasts
  copiedOne: string;
  copiedN: (n: number) => string;
  copiedSelected: (n: number) => string;
  copyFailed: string;
  labelApplied: (n: number) => string;
  // History
  historyTitle: string;
  historyEmpty: string;
  // Info dialog
  infoTitle: string;
  howToTitle: string;
  steps: { title: string; desc: string }[];
  faqTitle: string;
  faqs: FaqItem[];
  // On-page sections
  whyTitle: string;
  whyIntro: string;
  useCases: UseCase[];
  onPageFaqTitle: string;
  // Articles teaser
  readMoreTitle: string;
  readMoreCta: string;
  // a11y
  skipToContent: string;
  themeToggle: string;
  infoButton: string;
  historyButton: string;
  copyAria: string;
  selectAria: (email: string) => string;
}

const KEYBOARD_HELP_ID =
  "Tekan / untuk fokus ke kolom username. Ctrl+K untuk cari di hasil. Ctrl+Shift+A pilih/batal semua hasil tampil. Ctrl+Shift+C salin pintar (terpilih > tersaring > semua). Esc bersihkan pencarian.";
const KEYBOARD_HELP_EN =
  "Press / to focus the username field. Ctrl+K to search results. Ctrl+Shift+A to select/deselect all shown results. Ctrl+Shift+C for smart copy (selected > filtered > all). Esc clears the search.";

export const id: Dict = {
  lang: "id",
  htmlLang: "id",
  metaTitle: "Gmail Dot Trick: Generator Variasi Titik - DotMail",
  metaDescription:
    "Generator gmail dot trick gratis. Buat semua variasi titik untuk satu username Gmail dalam sekejap - privat, jalan di browser, tanpa login.",
  ogImageAlt: "DotMail | Generator Variasi Titik Gmail",
  brandTagline: "Generator dot trick Gmail",
  heroLine1: "Satu inbox.",
  heroEm: "Ratusan",
  heroLine2: "alamat.",
  heroSubtitle:
    "Gmail mengabaikan titik di username. Semua variasi di bawah masuk ke inbox yang sama. Generate pakai tools ini.",
  trustBadge: "100% di browser. Datamu tidak dikirim ke server.",
  tryLabel: "Coba:",
  modeDots: "Variasi titik",
  modePlus: "Plus alias",
  inputLabel: "Username Gmail kamu",
  placeholder: "contoh: satu",
  plusTagPlaceholder: "label: netflix, belanja, kerja",
  plusHint: "Pisahkan beberapa label dengan koma. Tiap label jadi satu alias.",
  generate: "Generate",
  generating: "Membuat...",
  combosReady: "kombinasi siap dibuat",
  fromChars: (n) => `dari ${n} karakter`,
  aliasReady: (n) => (n === 1 ? "alias siap dibuat" : "alias siap dibuat"),
  errors: {
    empty: "Masukkan username Gmail.",
    charset: "Hanya huruf a-z, angka 0-9, dan titik. Tanpa spasi atau simbol.",
    dotPattern: "Titik tidak boleh di awal, akhir, atau berurutan.",
    minLen: "Minimal 2 karakter (tanpa titik).",
    maxLen: "Maksimal 18 karakter - di atas itu jumlah kombinasi terlalu besar.",
  },
  plusEmptyError: "Masukkan minimal satu label.",
  resultsCount: (n) => `${n.toLocaleString("id-ID")} variasi`,
  searchPlaceholder: "Cari variasi...",
  selectAll: "Pilih semua",
  deselectAll: "Batal pilih semua",
  copySelected: "Salin",
  copyAll: "Salin semua",
  downloadCsv: "Unduh .csv",
  downloadTxt: "Unduh .txt",
  labelSelected: "Beri label ke terpilih",
  applyLabel: "Terapkan",
  labelPlaceholder: "nama layanan (mis. Netflix)",
  clearLabels: "Hapus semua label",
  noMatch: "Tidak ada variasi yang cocok.",
  emptyPlaceholder: "Hasil akan muncul di sini",
  loadMore: "Muat lebih",
  historyBack: "Kembali ke generator",
  copiedOne: "Disalin",
  copiedN: (n) => `Disalin ${n.toLocaleString("id-ID")} email`,
  copiedSelected: (n) => `Disalin ${n.toLocaleString("id-ID")} email terpilih`,
  copyFailed: "Gagal menyalin - periksa izin browser",
  labelApplied: (n) => `Label diterapkan ke ${n.toLocaleString("id-ID")} variasi`,
  historyTitle: "Riwayat username",
  historyEmpty: "Belum ada riwayat. Generate username untuk mulai menyimpan.",
  infoTitle: "Info & Bantuan",
  howToTitle: "Cara Pakai",
  steps: [
    { title: "1. Ketik username", desc: "sebelum @gmail.com." },
    { title: "2. Generate", desc: "Langsung keluar semua kombinasi." },
    { title: "3. Salin & pakai", desc: "Salin atau unduh .txt / .csv." },
  ],
  faqTitle: "Pertanyaan",
  faqs: [
    {
      q: "Apa itu Gmail dot trick?",
      a: "Gmail dot trick adalah fitur bawaan Gmail yang mengabaikan titik (.) di bagian username sebuah alamat. Jadi s.atu@gmail.com, sa.tu@gmail.com, dan satu@gmail.com semuanya masuk ke inbox yang sama. DotMail menghasilkan seluruh kombinasi titik dari satu username sekaligus.",
    },
    {
      q: "Legal?",
      a: "Iya. Ini fitur bawaan Gmail. Google tidak peduli titik di username, jadi semua variasi tetap masuk inbox yang sama. Bukan hack.",
    },
    {
      q: "Akun saya bisa diblokir?",
      a: "Kalau dipakai normal, aman. Risikonya hanya kalau disalahgunakan buat spam atau daftar masif yang melanggar aturan layanan lain.",
    },
    {
      q: "Data disimpan di mana?",
      a: "Semua diproses di browser kamu sendiri. Tidak ada server, tidak ada database, tidak ada yang mengintip input.",
    },
    {
      q: "Bisa buat apa saja?",
      a: "Filter email per layanan, mengecek siapa yang membocorkan email kamu, atau mengelola beberapa label dari satu inbox.",
    },
    {
      q: "Apakah dot trick jalan untuk daftar banyak akun?",
      a: "Sering tidak. Makin banyak layanan menormalkan titik sehingga menganggap semua variasi sebagai satu alamat. Untuk akun berbeda, dot trick tidak bisa diandalkan - kekuatan utamanya ada di filtering dan deteksi kebocoran, bukan multi-akun.",
    },
    {
      q: "Shortcut keyboard apa saja?",
      a: KEYBOARD_HELP_ID,
    },
  ],
  whyTitle: "Kenapa pakai dot trick?",
  whyIntro:
    "Satu username Gmail = banyak alamat yang masuk ke inbox yang sama. Kamu bisa memberi setiap layanan alamat uniknya sendiri tanpa bikin akun baru.",
  useCases: [
    {
      title: "Filter per layanan",
      desc: "Beri tiap layanan satu variasi (mis. ne.tflix@gmail.com), lalu buat filter Gmail otomatis berdasarkan alamat itu.",
    },
    {
      title: "Deteksi kebocoran data",
      desc: "Pakai variasi berbeda saat daftar. Kalau spam datang ke alamat itu, kamu tahu persis siapa yang menjual atau membocorkan data kamu.",
    },
    {
      title: "Rapikan inbox",
      desc: "Pisahkan promo, newsletter, dan notifikasi penting hanya dengan menaruh titik di tempat berbeda - tanpa pindah akun.",
    },
    {
      title: "Testing form & QA",
      desc: "Butuh banyak alamat unik untuk menguji alur signup atau email verifikasi? Semua tetap mendarat di satu inbox kamu.",
    },
  ],
  onPageFaqTitle: "Pertanyaan yang sering ditanya",
  readMoreTitle: "Pelajari lebih lanjut",
  readMoreCta: "Baca artikel",
  skipToContent: "Lewati ke konten utama",
  themeToggle: "Ganti tema",
  infoButton: "Info dan bantuan",
  historyButton: "Riwayat username",
  copyAria: "Salin",
  selectAria: (email) => `Pilih ${email}`,
};

export const en: Dict = {
  lang: "en",
  htmlLang: "en",
  metaTitle: "Gmail Dot Trick Generator: All Dot Variations - DotMail",
  metaDescription:
    "Free Gmail dot trick generator. Create every dot variation of one Gmail username instantly - private, runs in your browser, no login.",
  ogImageAlt: "DotMail | Gmail Dot Trick Generator",
  brandTagline: "Gmail dot trick generator",
  heroLine1: "One inbox.",
  heroEm: "Hundreds",
  heroLine2: "of addresses.",
  heroSubtitle:
    "Gmail ignores dots in the username. Every variation below lands in the same inbox. Generate them with this tool.",
  trustBadge: "100% in your browser - your input never leaves your device.",
  tryLabel: "Try:",
  modeDots: "Dot variants",
  modePlus: "Plus alias",
  inputLabel: "Your Gmail username",
  placeholder: "e.g. john",
  plusTagPlaceholder: "labels: netflix, shopping, work",
  plusHint: "Separate labels with commas. Each label becomes one alias.",
  generate: "Generate",
  generating: "Generating...",
  combosReady: "combinations ready",
  fromChars: (n) => `from ${n} characters`,
  aliasReady: (n) => (n === 1 ? "alias ready" : "aliases ready"),
  errors: {
    empty: "Enter a Gmail username.",
    charset: "Only letters a-z, digits 0-9, and dots. No spaces or symbols.",
    dotPattern: "Dots can't be at the start, end, or repeated.",
    minLen: "At least 2 characters (without dots).",
    maxLen: "Max 18 characters - beyond that the combination count is too large.",
  },
  plusEmptyError: "Enter at least one label.",
  resultsCount: (n) => `${n.toLocaleString("en-US")} variations`,
  searchPlaceholder: "Search variations...",
  selectAll: "Select all",
  deselectAll: "Deselect all",
  copySelected: "Copy",
  copyAll: "Copy all",
  downloadCsv: "Download .csv",
  downloadTxt: "Download .txt",
  labelSelected: "Label selected",
  applyLabel: "Apply",
  labelPlaceholder: "service name (e.g. Netflix)",
  clearLabels: "Clear all labels",
  noMatch: "No variations match.",
  emptyPlaceholder: "Results will appear here",
  copiedOne: "Copied",
  copiedN: (n) => `Copied ${n.toLocaleString("en-US")} emails`,
  copiedSelected: (n) => `Copied ${n.toLocaleString("en-US")} selected emails`,
  copyFailed: "Copy failed - check browser permissions",
  labelApplied: (n) => `Label applied to ${n.toLocaleString("en-US")} variations`,
  historyTitle: "Username history",
  historyEmpty: "No history yet. Generate a username to start saving.",
  infoTitle: "Info & Help",
  howToTitle: "How to use",
  steps: [
    { title: "1. Type a username", desc: "the part before @gmail.com." },
    { title: "2. Generate", desc: "Every combination appears instantly." },
    { title: "3. Copy & use", desc: "Copy or download as .txt / .csv." },
  ],
  faqTitle: "Questions",
  faqs: [
    {
      q: "What is the Gmail dot trick?",
      a: "The Gmail dot trick is a built-in Gmail feature that ignores dots (.) in the username part of an address. So j.ohn@gmail.com, jo.hn@gmail.com, and john@gmail.com all land in the same inbox. DotMail generates every dot combination of one username at once.",
    },
    {
      q: "Is it legal?",
      a: "Yes. It's a built-in Gmail feature. Google ignores dots in the username, so all variations reach the same inbox. It's not a hack.",
    },
    {
      q: "Can my account get banned?",
      a: "Used normally, it's safe. The only risk is abusing it for spam or mass signups that violate another service's terms.",
    },
    {
      q: "Where is my data stored?",
      a: "Everything runs in your own browser. No server, no database, nobody peeking at your input.",
    },
    {
      q: "What can I use it for?",
      a: "Filter email per service, find out who leaked your address, or organize many labels from one inbox.",
    },
    {
      q: "Does the dot trick work for multiple accounts?",
      a: "Often not. More services normalize dots and treat every variation as the same address. For separate accounts the dot trick is unreliable - its real strength is filtering and leak detection, not multi-account signups.",
    },
    {
      q: "What keyboard shortcuts are there?",
      a: KEYBOARD_HELP_EN,
    },
  ],
  whyTitle: "Why use the dot trick?",
  whyIntro:
    "One Gmail username = many addresses that all reach the same inbox. You can give every service its own unique address without creating a new account.",
  useCases: [
    {
      title: "Filter per service",
      desc: "Give each service one variation (e.g. ne.tflix@gmail.com), then auto-filter your Gmail based on that address.",
    },
    {
      title: "Detect data leaks",
      desc: "Use a different variation when signing up. When spam hits that address, you know exactly who sold or leaked your data.",
    },
    {
      title: "Tidy your inbox",
      desc: "Separate promos, newsletters, and important alerts just by placing dots differently - no extra accounts.",
    },
    {
      title: "Form & QA testing",
      desc: "Need many unique addresses to test signup or verification flows? They all still land in your one inbox.",
    },
  ],
  onPageFaqTitle: "Frequently asked questions",
  readMoreTitle: "Learn more",
  readMoreCta: "Read article",
  skipToContent: "Skip to main content",
  themeToggle: "Toggle theme",
  infoButton: "Info and help",
  historyButton: "Username history",
  copyAria: "Copy",
  selectAria: (email) => `Select ${email}`,
};

export const DICTS: Record<Lang, Dict> = { id, en };

const LangContext = createContext<Dict>(id);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={DICTS[lang]}>{children}</LangContext.Provider>;
}

export function useT(): Dict {
  return useContext(LangContext);
}
