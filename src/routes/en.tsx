import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";
import { homeHead } from "@/lib/seo";

export const Route = createFileRoute("/en")({
  head: () => homeHead("en"),
  component: () => <HomePage lang="en" />,
});
