import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";
import { homeHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => homeHead(),
  component: HomePage,
});
