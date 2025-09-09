import { Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo-stackoverflow.svg";
import { useAuth } from "@/contexts/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

import { _getNotificationByUserId, _markAsRead } from "@/services/notification";
import { socket } from "@/lib/socket";

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
              <>
                <NotificationDropdown user={user} />
                <Link to={"/account"}>
                  <Avatar className="size-8">
                    <AvatarImage src={user?.avatar} className="object-cover" />
                    <AvatarFallback>
                      {user?.username ? user.username[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
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
