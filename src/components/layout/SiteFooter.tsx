type Social = {
  href: string;
  label: string;
  handle: string;
  path: string;
};

const SOCIALS: Social[] = [
  {
    href: "https://t.me/alfidx",
    label: "Telegram",
    handle: "@alfidx",
    path: "M9.8 18.7l.3-4.2 7.7-6.9c.3-.3-.1-.5-.5-.2L7.7 13.3 3.6 12c-.9-.3-.9-.9.2-1.3L19.8 4.5c.7-.3 1.4.2 1.1 1.3l-2.7 12.8c-.2.9-.7 1.1-1.5.7L12.6 16.3l-2 1.9c-.2.2-.4.4-.8.4z",
  },
  {
    href: "https://x.com/alfindigital",
    label: "X",
    handle: "@alfindigital",
    path: "M18.2 2.2h3.3l-7.2 8.3 8.5 11.3h-6.7l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.2 2.2H8l4.7 6.2zM17 19.8h1.8L7.1 4.1H5.1z",
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="afd-foot" aria-label="Site footer">
      <div className="afd-glow" aria-hidden="true" />
      <span className="afd-cr">
        © {year}
        <a
          href="https://alfindigital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="afd-brand"
        >
          alfindigital
        </a>
      </span>
      {/* All socials always visible & keyboard-reachable. */}
      <nav className="afd-socials" aria-label="Social links">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="afd-soc"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={`${s.label} ${s.handle}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </nav>
    </footer>
  );
}
