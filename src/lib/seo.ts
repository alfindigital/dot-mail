import { abs, SITE_NAME } from "@/lib/site";
import { t } from "@/lib/i18n";

const OG_IMAGE = abs("/og.jpg");

export function homeHead() {
  const url = abs("/");
  return {
    meta: [
      { title: t.metaTitle },
      { name: "description", content: t.metaDescription },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: t.metaTitle },
      { property: "og:description", content: t.metaDescription },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: t.ogImageAlt },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: t.metaTitle },
      { name: "twitter:description", content: t.metaDescription },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: t.ogImageAlt },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "en-US",
          mainEntity: t.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}

export function infoHead() {
  const url = abs("/info");
  const title = "Info & Help: How to Use and FAQ - DotMail";
  const description =
    "How to use DotMail, what the Gmail dot trick is good for, and answers to common questions.";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: t.ogImageAlt },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "en-US",
          mainEntity: t.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}

export interface ArticleSeoInput {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
}

export function articleHead(a: ArticleSeoInput) {
  const url = abs(`/articles/${a.slug}`);
  return {
    meta: [
      { title: `${a.title} - ${SITE_NAME}` },
      { name: "description", content: a.description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "article" },
      { property: "og:title", content: a.title },
      { property: "og:description", content: a.description },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: a.title },
      { name: "twitter:description", content: a.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: a.title,
              description: a.description,
              inLanguage: "en-US",
              datePublished: a.datePublished,
              dateModified: a.dateModified,
              mainEntityOfPage: url,
              author: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
              publisher: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Articles", item: abs("/articles") },
                { "@type": "ListItem", position: 3, name: a.title, item: url },
              ],
            },
          ],
        }),
      },
    ],
  };
}
