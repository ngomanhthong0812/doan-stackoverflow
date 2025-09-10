import { createFileRoute } from "@tanstack/react-router";
import Stats from "@/components/features/stats";

export const Route = createFileRoute("/(app)/stats")({
  component: Stats,
});
