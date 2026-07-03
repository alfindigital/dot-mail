import type { ValidationError } from "@/lib/dot-variants";

export interface FaqItem {
  q: string;
  a: string;
}

export interface UseCase {
  title: string;
  desc: string;
}

export interface Dict {
  // Head / SEO
  metaTitle: string;
  metaDescription: string;
  ogImageAlt: string;
  // Hero
  heroLine1: string;
  heroEm: string;
  heroLine2: string;
  heroSubtitle: string;
  trustBadge: string;
  // Generator
  inputLabel: string;
  placeholder: string;
  generate: string;
  combosReady: string;
  fromChars: (n: number) => string;
  errors: Record<ValidationError, string>;
  // Results
  resultsCount: (n: number) => string;
  copySelected: string;
  copyAll: string;
  copyFilter: string;
  copyFilterHint: string;
  filterCopied: string;
  shareLink: string;
  shareCopied: string;
  downloadCsv: string;
  labelSelected: string;
  applyLabel: string;
  labelPlaceholder: string;
  clearLabels: string;
  emptyPlaceholder: string;
  emptyDemoHint: string;
  loadMore: string;
  historyBack: string;
  // toasts
  copiedN: (n: number) => string;
  copiedSelected: (n: number) => string;
  copyFailed: string;
  labelApplied: (n: number) => string;
  // History
  historyTitle: string;
  historyEmpty: string;
  historyRemove: (u: string) => string;
  // Info page
  infoTitle: string;
  howToTitle: string;
  steps: { title: string; desc: string }[];
  onPageFaqTitle: string;
  faqs: FaqItem[];
  // Why section
  whyTitle: string;
  whyIntro: string;
  useCases: UseCase[];
  // Articles teaser
  readMoreTitle: string;
  readMoreCta: string;
  // a11y
  themeToggle: string;
  infoButton: string;
  historyButton: string;
  copyAria: string;
  selectAria: (email: string) => string;
}

const KEYBOARD_HELP =
  "Press / to focus the username field. Enter to generate. Use the checkbox on each row to select variations.";

export const t: Dict = {
  metaTitle: "Gmail Dot Trick Generator: All Dot Variations - DotMail",
  metaDescription:
    "Free Gmail dot trick generator. Create every dot variation of a Gmail username instantly - private, runs in your browser, no login.",
  ogImageAlt: "DotMail | Gmail Dot Trick Generator",
  heroLine1: "One inbox.",
  heroEm: "Hundreds",
  heroLine2: "of addresses.",
  heroSubtitle:
    "Gmail ignores dots in usernames - every variation lands in the same inbox.",
  trustBadge: "100% private, runs in your browser.",
  inputLabel: "Your Gmail username",
  placeholder: "e.g. john",
  generate: "Generate",
  combosReady: "combinations ready",
  fromChars: (n) => `from ${n} characters`,
  errors: {
    empty: "Enter a Gmail username.",
    charset: "Only letters a-z, digits 0-9, and dots. No spaces or symbols.",
    dotPattern: "Dots can't be at the start, end, or repeated.",
    minLen: "At least 2 characters (without dots).",
    maxLen: "Max 18 characters - beyond that the combination count is too large.",
  },
  resultsCount: (n) => `${n.toLocaleString("en-US")} variations`,
  copySelected: "Copy",
  copyAll: "Copy all",
  copyFilter: "Copy Gmail filter",
  copyFilterHint: "Paste into Gmail search to filter all these addresses at once.",
  filterCopied: "Gmail filter query copied - paste in Gmail search",
  shareLink: "Share link",
  shareCopied: "Share link copied to clipboard",
  downloadCsv: "Download .csv",
  labelSelected: "Label selected",
  applyLabel: "Apply",
  labelPlaceholder: "service name (e.g. Netflix)",
  clearLabels: "Clear all labels",
  emptyPlaceholder: "Try it - here is what john would generate:",
  emptyDemoHint: "Type your username above to get your own set.",
  loadMore: "Load more",
  historyBack: "Back to generator",
  copiedN: (n) => `Copied ${n.toLocaleString("en-US")} emails`,
  copiedSelected: (n) => `Copied ${n.toLocaleString("en-US")} selected emails`,
  copyFailed: "Copy failed - check browser permissions",
  labelApplied: (n) => `Label applied to ${n.toLocaleString("en-US")} variations`,
  historyTitle: "Username history",
  historyEmpty: "No history yet. Generate a username to start saving.",
  historyRemove: (u) => `Remove ${u}`,
  infoTitle: "Info & Help",
  howToTitle: "How to use",
  steps: [
    { title: "1. Type a username", desc: "the part before @gmail.com." },
    { title: "2. Generate", desc: "Every combination appears instantly." },
    { title: "3. Copy & use", desc: "Copy or download as .csv." },
  ],
  onPageFaqTitle: "Frequently asked questions",
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
      a: KEYBOARD_HELP,
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
  readMoreTitle: "Learn more",
  readMoreCta: "Read article",
  themeToggle: "Toggle theme",
  infoButton: "Info and help",
  historyButton: "Username history",
  copyAria: "Copy",
  selectAria: (email) => `Select ${email}`,
};

export function useT(): Dict {
  return t;
}
