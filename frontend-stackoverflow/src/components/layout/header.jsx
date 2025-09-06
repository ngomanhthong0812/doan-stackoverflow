import { Search, Inbox, Bell, Award, HelpCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-stackoverflow.svg";
import { useAuth } from "@/contexts/auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex h-12 container items-center gap-4 justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="block px-3">
            <img src={logo} alt="Logo" className="h-7 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="min-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search..." className="w-full pl-8" />
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <Link to={"/account"}>
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatar} className="object-cover" />
                  <AvatarFallback>
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="border !border-[#1b75d0] !text-[#1b75d0] !bg-transparent hover:!bg-blue-400/10">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="!bg-[#1b75d0] !text-white hover:!bg-[#155ca2]">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
