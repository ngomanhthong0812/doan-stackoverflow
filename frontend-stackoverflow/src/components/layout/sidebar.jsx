import {
  ChartCandlestick,
  Code,
  Home,
  MessageSquare,
  Share,
  Tag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth";

export default function Sidebar() {
  const { user } = useAuth();
  const matchRoute = useMatchRoute();

  // menu cơ bản
  const menu = [
    { icon: Home, label: "Home", to: "/" },
    { icon: MessageSquare, label: "Questions", to: "/questions" },
    { icon: Tag, label: "Tags", to: "/tags" },
    { icon: Share, label: "Shared Files", to: "/shared-files" },
    { icon: Code, label: "Frontend lag", to: "/frontend-lag" },
    { icon: ChartCandlestick, label: "Stats", to: "/stats", adminOnly: true }, // adminOnly
  ];

  // lọc menu nếu user không phải admin
  const filteredMenu = menu.filter(
    (item) => !item.adminOnly || (user && user.role === "admin")
  );

  return (
    <aside className="w-45 border-r bg-white pr-2 py-2">
      <div className="sticky top-[60px] flex flex-col gap-4">
        {/* Menu chính */}
        <nav className="flex flex-col gap-1">
          {filteredMenu.map(({ icon: Icon, label, to, badge }) => {
            const isActive = !!matchRoute({ to, fuzzy: false });

            return (
              <Link
                key={label}
                to={to}
                className={cn(
                  "flex items-center gap-2 text-sm rounded-md px-3 py-2 transition",
                  isActive
                    ? "bg-gray-200 text-gray-900 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-auto rounded px-1.5 py-0.5 text-xs">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collectives */}
        <div>
          <h3 className="px-3 text-xs font-bold uppercase text-gray-500">
            Collectives
          </h3>
          <div className="px-3 py-2 text-xs text-gray-600">
            Communities for your favorite technologies.{" "}
            <a href="#" className="text-[#155ca2] hover:underline">
              Explore all Collectives
            </a>
          </div>
        </div>

        {/* Teams */}
        <div>
          <h3 className="px-1 text-xs font-bold uppercase text-gray-500">
            Teams
          </h3>
          <div className="mt-2 rounded-md border p-3 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Ask questions, find answers and collaborate
              </span>
            </div>
            <div className="mt-2">at work with Stack Overflow for Teams.</div>
            <button className="mt-3 w-full rounded-md bg-orange-500 text-white text-sm hover:bg-orange-600">
              Try Team for free
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
