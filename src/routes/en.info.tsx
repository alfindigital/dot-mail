import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { infoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/info")({
  head: () => infoHead("en"),
  component: () => <InfoPage lang="en" />,
});
