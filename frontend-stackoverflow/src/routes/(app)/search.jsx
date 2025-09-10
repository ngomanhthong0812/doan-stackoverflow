import Search from "@/components/features/search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/search")({
  component: Search,
});
