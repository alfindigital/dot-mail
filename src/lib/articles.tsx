import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO
  dateModified: string; // ISO
  readMins: number;
  excerpt: string;
  body: () => ReactNode;
}

// --- Tiny prose primitives (no typography plugin in this project) ---
function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-2xl text-foreground mt-10 mb-3">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-muted-foreground mt-4">{children}</p>;
}
function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}
function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  );
}
function A({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-accent underline underline-offset-2 hover:opacity-80">
      {children}
    </Link>
  );
}
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

export const ARTICLES: Article[] = [
  {
    slug: "cara-filter-gmail-dengan-titik",
    title: "Cara Filter Email di Gmail Pakai Trik Titik (Langkah demi Langkah)",
    description:
      "Pisahkan email per layanan secara otomatis pakai Gmail dot trick. Panduan lengkap membuat filter berdasarkan variasi titik.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 5,
    excerpt:
      "Beri tiap layanan satu variasi titik, lalu buat filter otomatis di Gmail. Begini langkah lengkapnya.",
    body: () => (
      <>
        <P>
          Gmail mengabaikan titik di bagian username. Artinya <Code>ne.tflix@gmail.com</Code> dan{" "}
          <Code>netflix@gmail.com</Code> sama-sama masuk ke inbox kamu. Sifat ini bisa kamu pakai
          untuk memberi setiap layanan satu alamat unik, lalu memfilternya otomatis.
        </P>
        <H2>Langkah 1 - Buat variasi unik per layanan</H2>
        <P>
          Buka <A to="/">generator DotMail</A>, ketik username Gmail kamu, dan pilih satu variasi
          untuk tiap layanan. Catat pasangannya, misalnya:
        </P>
        <UL>
          <li>
            Netflix → <Code>na.mahkamu@gmail.com</Code>
          </li>
          <li>
            Toko online → <Code>nama.kamu@gmail.com</Code>
          </li>
          <li>
            Newsletter → <Code>n.amakamu@gmail.com</Code>
          </li>
        </UL>
        <H2>Langkah 2 - Pakai alamat itu saat mendaftar</H2>
        <P>
          Saat sign up ke layanan, masukkan variasi yang sudah kamu pilih. Email tetap mendarat di
          inbox yang sama, tapi kolom "To" sekarang membawa penanda layanan.
        </P>
        <H2>Langkah 3 - Buat filter di Gmail</H2>
        <OL>
          <li>Di Gmail, klik ikon pencarian lanjutan (slider) di kotak cari.</li>
          <li>
            Isi kolom <strong>To</strong> dengan variasi spesifik, mis.{" "}
            <Code>na.mahkamu@gmail.com</Code>.
          </li>
          <li>Klik "Create filter".</li>
          <li>
            Pilih aksinya: beri label, skip inbox, arsipkan, atau teruskan. Klik "Create filter"
            lagi.
          </li>
        </OL>
        <P>
          Selesai. Mulai sekarang email dari layanan itu otomatis dirapikan. Ulangi untuk tiap
          layanan.
        </P>
        <H2>Tips</H2>
        <UL>
          <li>Gunakan satu variasi konsisten per layanan supaya filter gampang dikelola.</li>
          <li>
            Kombinasikan dengan <A to="/artikel/dot-trick-vs-plus-addressing">plus addressing</A>{" "}
            bila kamu ingin label yang lebih terbaca seperti <Code>+netflix</Code>.
          </li>
          <li>
            Mau melacak kebocoran data? Lihat{" "}
            <A to="/artikel/deteksi-kebocoran-email">panduan deteksi kebocoran</A>.
          </li>
        </UL>
      </>
    ),
  },
  {
    slug: "dot-trick-vs-plus-addressing",
    title: "Gmail Dot Trick vs Plus Addressing: Mana yang Lebih Baik?",
    description:
      "Perbandingan dot trick (titik) dan plus addressing (+tag) di Gmail: cara kerja, kelebihan, kekurangan, dan kapan memakai yang mana.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 6,
    excerpt:
      "Dua trik alias Gmail, dua karakter berbeda. Mana yang cocok untuk filtering, mana untuk leak detection?",
    body: () => (
      <>
        <P>
          Gmail punya dua cara membuat banyak alamat dari satu akun: <strong>dot trick</strong>{" "}
          (menyisipkan titik) dan <strong>plus addressing</strong> (menambah <Code>+tag</Code>).
          Keduanya mengarah ke inbox yang sama, tapi karakternya beda.
        </P>
        <H2>Cara kerja</H2>
        <UL>
          <li>
            <strong>Dot trick:</strong> <Code>jo.hn@gmail.com</Code> = <Code>john@gmail.com</Code>.
            Titik diabaikan total oleh Gmail.
          </li>
          <li>
            <strong>Plus addressing:</strong> <Code>john+netflix@gmail.com</Code> ={" "}
            <Code>john@gmail.com</Code>. Semua setelah tanda <Code>+</Code> diabaikan.
          </li>
        </UL>
        <H2>Kelebihan & kekurangan</H2>
        <P>
          <strong>Dot trick</strong> terlihat seperti alamat normal - banyak form menerimanya tanpa
          curiga. Tapi labelnya tidak terbaca manusia, dan jumlah variasinya terbatas pada panjang
          username.
        </P>
        <P>
          <strong>Plus addressing</strong> labelnya jelas (<Code>+belanja</Code>,{" "}
          <Code>+kerja</Code>) dan tak terbatas. Kelemahannya: sebagian layanan menolak tanda{" "}
          <Code>+</Code> di form, atau justru gampang dihapus orang yang ingin "membersihkan"
          alamat.
        </P>
        <H2>Kapan pakai yang mana?</H2>
        <UL>
          <li>
            <strong>Filtering rapi & label terbaca:</strong> plus addressing. Coba mode "Plus alias"
            di <A to="/">generator</A>.
          </li>
          <li>
            <strong>Form yang rewel soal simbol:</strong> dot trick, karena tampak seperti email
            biasa.
          </li>
          <li>
            <strong>Deteksi kebocoran:</strong> keduanya bisa, tapi dot trick lebih sulit ditebak
            pihak ketiga. Lihat{" "}
            <A to="/artikel/deteksi-kebocoran-email">panduan deteksi kebocoran</A>.
          </li>
        </UL>
        <P>
          Tidak harus memilih satu. Banyak orang memakai dot trick untuk identitas "tersamar" dan
          plus addressing untuk pelabelan internal. Penasaran apakah trik ini masih jalan? Baca{" "}
          <A to="/artikel/apakah-gmail-dot-trick-masih-work-2026">status dot trick 2026</A>.
        </P>
      </>
    ),
  },
  {
    slug: "apakah-gmail-dot-trick-masih-work-2026",
    title: "Apakah Gmail Dot Trick Masih Berfungsi di 2026?",
    description:
      "Status dot trick Gmail di 2026: apakah masih jalan, kenapa sebagian layanan menolaknya, dan apa alternatif yang lebih andal.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 4,
    excerpt:
      "Jawaban singkat: ya, di sisi Gmail masih 100% jalan. Tapi ada satu hal penting yang berubah.",
    body: () => (
      <>
        <P>
          Jawaban singkat: <strong>ya</strong>. Di sisi Gmail, dot trick masih bekerja sempurna pada
          2026. Google tetap mengabaikan titik di username, jadi semua variasi mendarat di inbox
          yang sama persis seperti dulu.
        </P>
        <H2>Lalu apa yang berubah?</H2>
        <P>
          Yang berubah adalah <strong>sisi layanan pihak ketiga</strong>. Makin banyak situs yang
          "menormalkan" alamat email - mereka menghapus titik sebelum menyimpan, sehingga{" "}
          <Code>jo.hn@gmail.com</Code> dan <Code>john@gmail.com</Code> dianggap satu orang yang
          sama.
        </P>
        <P>Dampaknya:</P>
        <UL>
          <li>
            Untuk <strong>mendaftar banyak akun</strong> di layanan yang sama: sering gagal, karena
            mereka menganggapnya duplikat.
          </li>
          <li>
            Untuk <strong>filtering & deteksi kebocoran</strong>: tetap andal, karena yang penting
            adalah alamat yang tertulis di header email yang masuk ke kamu.
          </li>
        </UL>
        <H2>Kesimpulan</H2>
        <P>
          Dot trick belum mati - hanya use case-nya bergeser. Pakai untuk{" "}
          <A to="/artikel/cara-filter-gmail-dengan-titik">filtering</A> dan{" "}
          <A to="/artikel/deteksi-kebocoran-email">leak detection</A>, bukan untuk menggandakan
          akun. Kalau butuh label yang lebih fleksibel, pertimbangkan{" "}
          <A to="/artikel/dot-trick-vs-plus-addressing">plus addressing</A>.
        </P>
        <P>
          Mau coba? <A to="/">Generate semua variasi titik kamu di sini.</A>
        </P>
      </>
    ),
  },
  {
    slug: "deteksi-kebocoran-email",
    title: "Cara Melacak Siapa yang Membocorkan Alamat Email Kamu",
    description:
      "Gunakan variasi titik unik per layanan untuk mendeteksi sumber spam dan kebocoran data. Langkah praktis dan contohnya.",
    datePublished: "2026-06-22",
    dateModified: "2026-06-22",
    readMins: 5,
    excerpt:
      "Kalau spam datang ke alamat yang cuma kamu pakai untuk satu layanan, kamu tahu persis siapa pelakunya.",
    body: () => (
      <>
        <P>
          Pernah dapat spam dan bingung dari mana mereka tahu email kamu? Dengan dot trick, kamu
          bisa memberi setiap layanan "sidik jari" alamat sendiri. Saat spam muncul, kamu langsung
          tahu sumbernya.
        </P>
        <H2>Idenya</H2>
        <P>
          Setiap layanan dapat satu variasi titik unik. Karena hanya kamu yang tahu pasangan
          "layanan → variasi", alamat yang muncul di email masuk membongkar sumbernya.
        </P>
        <H2>Langkah praktis</H2>
        <OL>
          <li>
            Buka <A to="/">generator</A> dan buat variasi titik dari username kamu.
          </li>
          <li>
            Beri label tiap variasi (fitur "Beri label" ada di daftar hasil) lalu unduh sebagai CSV
            sebagai catatan.
          </li>
          <li>Pakai variasi berbeda saat mendaftar ke tiap layanan penting.</li>
          <li>
            Saat ada email mencurigakan, cek alamat di kolom "To". Cocokkan dengan catatan CSV kamu.
          </li>
        </OL>
        <H2>Contoh</H2>
        <P>
          Kamu daftar ke sebuah toko pakai <Code>na.makamu@gmail.com</Code>. Sebulan kemudian ada
          promo judi masuk ke alamat itu. Karena hanya toko itu yang punya variasi tersebut, kamu
          tahu data kamu bocor dari sana - bukti kuat untuk berhenti memakai layanan itu.
        </P>
        <H2>Catatan</H2>
        <P>
          Sebagian layanan menormalkan titik (lihat{" "}
          <A to="/artikel/apakah-gmail-dot-trick-masih-work-2026">apakah dot trick masih work</A>).
          Untuk jaga-jaga, kamu bisa memadukan dengan{" "}
          <A to="/artikel/dot-trick-vs-plus-addressing">plus addressing</A> yang labelnya lebih
          eksplisit.
        </P>
      </>
    ),
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
