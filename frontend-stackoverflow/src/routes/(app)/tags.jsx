import Tag from "@/components/features/tag";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/tags")({
  component: Tag,
});
