import ResetPasswordPage from "@/components/features/reset-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/reset-password/$token")({
  component: ResetPasswordPage,
});
