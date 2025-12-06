import DataStructuresAlgorithms from '@/components/features/data-structures-algorithms';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/(app)/data-structures-algorithms")({
  component: DataStructuresAlgorithms,
});