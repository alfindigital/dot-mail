import { createFileRoute } from "@tanstack/react-router";
import { HistoryPage } from "@/components/HistoryPage";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/riwayat")({
  head: () => ({
    meta: [
      { title: "Riwayat username - DotMail" },
      { name: "description", content: "Riwayat username Gmail yang pernah kamu generate di DotMail." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Riwayat username - DotMail" },
      { property: "og:url", content: abs("/riwayat") },
    ],
    links: [{ rel: "canonical", href: abs("/riwayat") }],
  }),
  component: () => <HistoryPage lang="id" />,
});
