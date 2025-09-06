import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/contexts/auth";
import {
  createRootRoute,
  Outlet,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";

function RootComponent() {
  const { location } = useRouterState();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Trang không có layout
  const noLayoutPages = ["/login", "/register"];
  const isNoLayoutPage = noLayoutPages.includes(location.pathname);

  // Trang private cần login
  const privatePages = ["/account", "/questions/ask"];
  const isPrivatePage = privatePages.includes(location.pathname);

  // Chặn truy cập trang private nếu chưa login
  useEffect(() => {
    if (!loading && !user && isPrivatePage) {
      navigate({ to: "/login" });
    }
  }, [loading, user, isPrivatePage, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {isNoLayoutPage ? (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex h-screen items-center justify-center bg-gray-100">
            <Outlet />
            <Toaster />
          </main>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1 container">
            <Sidebar />
            <main className="flex-1 py-4">
              <Outlet />
              <Toaster />
            </main>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
