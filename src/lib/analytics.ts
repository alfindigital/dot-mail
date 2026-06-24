// Privacy-friendly GA4, fully opt-in. No script is emitted unless
// VITE_GA4_ID is set at build time (e.g. VITE_GA4_ID=G-XXXXXXXXXX).
// IP anonymization is on; no ad signals.
export const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim() || undefined;

type HeadScript = { src: string; async?: boolean } | { children: string };

export function analyticsScripts(): HeadScript[] {
  if (!GA4_ID) return [];
  return [
    { src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`, async: true },
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{anonymize_ip:true,allow_google_signals:false});`,
    },
  ];
}
