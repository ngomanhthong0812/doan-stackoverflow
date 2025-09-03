import QuestionDetail from "@/components/features/question/detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/questions/$idName")({
  component: QuestionDetail,
});
