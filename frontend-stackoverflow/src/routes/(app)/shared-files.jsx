import SharedFiles from "@/components/features/shared-files";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/shared-files")({
  component: SharedFiles,
});
