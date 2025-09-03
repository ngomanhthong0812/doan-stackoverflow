import QuestionAsk from "@/components/features/question/ask";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/questions/ask")({
  component: QuestionAsk,
});
