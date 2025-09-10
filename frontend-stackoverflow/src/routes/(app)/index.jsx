import Home from "@/components/features/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: Home,
});
