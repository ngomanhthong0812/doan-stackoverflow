import { useAuth } from "@/contexts/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="px-4 py-2 ml-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
    >
      Đăng xuất
    </button>
  );
}
