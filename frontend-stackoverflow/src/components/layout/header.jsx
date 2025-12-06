import { Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

import { _getNotificationByUserId, _markAsRead } from "@/services/notification";
import { socket } from "@/lib/socket";
import { Button } from "../ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex h-12 container items-center gap-4 justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/questions" className="flex items-center gap-2 px-3">
            <img src="/Logo.png" alt="Logo" className="h-11 w-auto" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-300 text-transparent bg-clip-text drop-shadow-sm">
              CodeBuddy
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <SearchBox />
          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationDropdown user={user} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="size-8 cursor-pointer">
                      <AvatarImage
                        src={user?.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user?.username ? user.username[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>

                  <PopoverContent className="w-56 p-4">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={user?.avatar}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {user?.username?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user?.username}</span>
                          <span className="text-xs text-gray-500">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      <hr className="my-2 w-full" />

                      <Button
                        variant="ghost"
                        className="w-full mt-1"
                        onClick={() => (window.location.href = "/account")}
                      >
                        Account
                      </Button>
                      <Button
                        onClick={logout}
                        className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors rounded-md py-2 font-medium"
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
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

export function NotificationDropdown({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await _getNotificationByUserId(user._id);
      setNotifications(res);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("getNotification");
    };
  }, []);

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    await _markAsRead(id);
  };

  const handleClickNotification = async (n) => {
    await handleMarkRead(n._id);

    setOpen(false);
    navigate({
      to: "/questions/$id",
      params: { id: n.postId },
      replace: true,
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Inbox size={22} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-medium shadow">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-96 p-0"
      >
        <div className="px-4 py-2 text-sm font-semibold border-b">
          Notifications
        </div>

        <div className="divide-y max-h-105 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClickNotification(n)}
              className={`flex flex-col items-start px-4 py-3 gap-1 cursor-pointer hover:bg-gray-50 ${
                n.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <p className="text-sm font-medium">{n.title || n.type}</p>
              <p className="text-xs text-gray-600">
                {n.description || n.content}
              </p>
              <span className="text-[11px] text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate({ to: "/search", search: { key: query.trim() } });
  };

  return (
    <div className="min-w-md">
      <div className="relative">
        <Search
          onClick={handleSearch}
          className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-500 cursor-pointer"
        />
        <Input
          placeholder="Search..."
          className="w-full pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
    </div>
  );
}
