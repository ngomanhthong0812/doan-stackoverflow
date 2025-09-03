import Question from "@/components/features/question";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/questions/")({
  component: Question,
});
