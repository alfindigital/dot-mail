# DotMail

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Built with TanStack](https://img.shields.io/badge/built%20with-TanStack%20Start-orange)](https://tanstack.com/start)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-purple)](https://web.dev/progressive-web-apps/)

> **Gmail dot trick generator** — instantly create every valid dot-placement variation of any Gmail username. Free, private, and runs entirely in your browser.

## What is the Gmail Dot Trick?

Gmail ignores dots (`.`) in the local part of an address — `john.doe@gmail.com`, `j.ohn.doe@gmail.com`, and `johndoe@gmail.com` all deliver to the same inbox. DotMail enumerates every possible dot variation of a username so you can:

- Sign up for multiple services using a single Gmail account
- Filter incoming email by alias
- Test form validation with distinct-looking but equivalent addresses

## Features

- ⚡ **Instant generation** — all 2ⁿ⁻¹ dot variants computed in the browser
- 🔒 **Fully private** — no data leaves your device; no server-side processing
- 📋 **One-click copy** — copy any variant to clipboard instantly
- 🏷️ **Label aliases** — tag variants to remember what each one is used for
- 🕑 **Search history** — recent usernames are stored in `localStorage`
- 🌙 **Dark mode** — system-aware with manual toggle, FOUC-free
- 📱 **PWA-ready** — installable on mobile and desktop
- 🌍 **i18n-ready** — internationalisation architecture in place
- ♿ **Accessible** — keyboard navigable, screen-reader friendly

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20 or [Bun](https://bun.sh) ≥ 1.1

### Clone & Install

```bash
git clone https://github.com/alfindigital/dot-mail.git
cd dot-mail

# with bun (recommended)
bun install

# or with npm
npm install
```

### Configure

```bash
cp .env.example .env
# Edit .env — set SITE_URL to your domain for production SEO
```

### Develop

```bash
bun dev       # starts dev server at http://localhost:3000
# or
npm run dev
```

### Build & Preview

```bash
bun run build
bun run preview
```

### Other Scripts

| Command | Description |
|---|---|
| `bun run lint` | ESLint code check |
| `bun run format` | Prettier format |
| `bun run test:e2e` | Playwright end-to-end tests |
| `bun run validate:jsonld` | Validate JSON-LD structured data |

## Project Structure

```
dot-mail/
├── src/
│   ├── components/
│   │   ├── generator/      # GeneratorCard, ResultsList
│   │   ├── layout/         # Header, Footer, ThemeToggle, etc.
│   │   ├── sections/       # ArticleTeaser
│   │   └── ui/             # shadcn/ui primitives
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── dot-variants.ts # Core dot-trick algorithm
│   │   ├── analytics.ts    # Optional GA4 (env-gated)
│   │   ├── i18n.tsx        # Internationalisation
│   │   ├── recent-usernames.ts # localStorage history
│   │   ├── seo.ts          # SEO utilities
│   │   └── site.ts         # Canonical URL config
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx      # App shell, head tags
│   │   ├── index.tsx       # Home page
│   │   ├── history.tsx     # History page
│   │   └── articles/       # SEO article pages
│   └── server.ts           # Nitro/Cloudflare Worker entry
├── public/                 # Static assets (favicons, manifest)
├── e2e/                    # Playwright tests
├── scripts/                # Build-time audit scripts
├── .env.example            # Environment variable template
└── vite.config.ts          # Vite + TanStack Start config
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR/SSG) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| UI | [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Validation | [Zod](https://zod.dev) |
| Bundler | [Vite 7](https://vitejs.dev) |
| Runtime | [Nitro](https://nitro.build) / Cloudflare Workers |
| Language | TypeScript 5 |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SITE_URL` | Recommended | Canonical domain for SEO (`https://your-domain.com`) |
| `VITE_GA4_ID` | Optional | Google Analytics 4 ID (privacy-friendly, opt-in) |

See [`.env.example`](.env.example) for a full template.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

Please report security vulnerabilities responsibly. See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 contributors
