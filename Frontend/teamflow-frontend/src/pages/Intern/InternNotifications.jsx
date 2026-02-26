import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bell, CheckCheck, Clock, Inbox } from "lucide-react";

export default function InternNotifications() {
  const [notifications, setNotifications] = useState([]);

  /* ⭐ FETCH */
  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ⭐ MARK ALL AS READ (LOGIC KEPT SAME) */
  const markAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.is_read);

      if (unread.length === 0) return;

      await Promise.all(
        unread.map((n) => api.put(`/notifications/read/${n.id}`))
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.log("mark all read error", err);
    }
  };

  /* ⭐ MARK SINGLE AS READ */
  const markOneRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.log("mark read error", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-8 p-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium bg-[#8b7cf6]/20 text-[#8b7cf6] rounded-full border border-[#8b7cf6]/30 animate-pulse">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Stay updated with your activity
          </p>
        </div>

        {/* ⭐ MARK ALL BUTTON FIXED */}
        <button
          disabled={unreadCount === 0}
          onClick={markAllRead}
          className="group flex items-center gap-2 px-4 py-2 bg-[#2c274b] hover:bg-[#322d52] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 text-[#8b7cf6] hover:text-[#a99cff] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* LIST */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1f1b36]/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#8b7cf6]" />
            <span className="text-sm font-medium">Notification Center</span>
          </div>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {notifications.length} total
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-white/5">
              <Inbox className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markOneRead(n.id)}
                className={`group relative p-5 transition-all duration-300 cursor-pointer
                  ${
                    !n.is_read
                      ? "bg-[#2c274b] hover:bg-[#352f57]"
                      : "bg-[#1f1b36] hover:bg-[#2a2445]"
                  }
                  hover:pl-6 border-l-2 border-l-transparent hover:border-l-[#8b7cf6]`}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className={`relative p-2.5 rounded-xl transition-all duration-300
                    ${
                      !n.is_read
                        ? "bg-[#8b7cf6]/20 group-hover:bg-[#8b7cf6]/30"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Bell
                      size={18}
                      className={`transition-all duration-300
                        ${
                          !n.is_read
                            ? "text-[#8b7cf6] group-hover:scale-110"
                            : "text-gray-400 group-hover:text-gray-300"
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        !n.is_read ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {n.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400">
                        {new Date(n.created_at).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {!n.is_read && (
                    <>
                      <span className="text-xs text-[#8b7cf6] bg-[#8b7cf6]/10 px-2 py-1 rounded-full">
                        New
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#8b7cf6] animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}