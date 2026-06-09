// Guarded PWA registration. Refuses in dev, Lovable preview iframes,
// preview hostnames, or when ?sw=off is set. In refused contexts it
// also unregisters any existing /sw.js so stale workers can't survive.

export function registerPWA() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const url = new URL(window.location.href);
  const host = window.location.hostname;

  const isPreviewHost =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");

  const isIframed = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const killSwitch = url.searchParams.get("sw") === "off";
  const refuse = !import.meta.env.PROD || isIframed || isPreviewHost || killSwitch;

  if (refuse) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => {
        for (const r of regs) {
          const scriptURL = r.active?.scriptURL ?? r.installing?.scriptURL ?? r.waiting?.scriptURL ?? "";
          if (scriptURL.endsWith("/sw.js")) r.unregister();
        }
      })
      .catch(() => {});
    return;
  }

  // Lazy import so workbox-window isn't bundled into refused contexts.
  import("workbox-window")
    .then(({ Workbox }) => {
      const wb = new Workbox("/sw.js");
      wb.register().catch(() => {});
    })
    .catch(() => {});
}
