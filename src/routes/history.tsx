import { createFileRoute } from "@tanstack/react-router";
import { HistoryPage } from "@/components/HistoryPage";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Username history - DotMail" },
      { name: "description", content: "Recent Gmail usernames you generated on DotMail." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Username history - DotMail" },
      { property: "og:url", content: abs("/history") },
    ],
    links: [{ rel: "canonical", href: abs("/history") }],
  }),
  component: HistoryPage,
});
