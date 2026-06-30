import { createFileRoute } from "@tanstack/react-router";
import { HistoryPage } from "@/components/HistoryPage";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/en/riwayat")({
  head: () => ({
    meta: [
      { title: "Username history - DotMail" },
      { name: "description", content: "Your recent Gmail usernames generated on DotMail." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Username history - DotMail" },
      { property: "og:url", content: abs("/en/riwayat") },
    ],
    links: [{ rel: "canonical", href: abs("/en/riwayat") }],
  }),
  component: () => <HistoryPage lang="en" />,
});
