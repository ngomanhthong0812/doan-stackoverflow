import EditPreview from '@/components/features/question/edit-preview';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/(app)/questions/edit-preview/$id")({
  component: EditPreview,
});