import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { infoHead } from "@/lib/seo";

export const Route = createFileRoute("/info")({
  head: () => infoHead(),
  component: InfoPage,
});
