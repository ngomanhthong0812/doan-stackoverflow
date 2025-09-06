import QuestionEdit from "@/components/features/question/edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/questions/edit/$id")({
  component: QuestionEdit,
});
