import { useEffect } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate({ to: "/" });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-medium">Logging in...</p>
    </div>
  );
}

export const Route = createFileRoute("/(auth)/oauth-success")({
  component: RouteComponent,
});
