import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircle, Clock, Info } from "lucide-react";

export default function HrNotifications() {
  const [notifications, setNotifications] = useState([]);

  const fetch = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  /* ⭐ MARK ALL READ */
  const markAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => api.put(`/notifications/read/${n.id}`))
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.log("mark all read error", err);
    }
  };

  /* ⭐ MARK SINGLE READ */
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

  const icon = (type) => {
    if (type === "success") return <CheckCircle className="text-green-400" />;
    if (type === "warning") return <Clock className="text-yellow-400" />;
    return <Info className="text-blue-400" />;
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    return Math.floor(diff / 86400) + " days ago";
  };

  return (
    <div className="space-y-6">

      {/* ⭐ HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-400">All system notifications</p>
        </div>

        <button
          onClick={markAllRead}
          className="text-[#8b7cf6] hover:text-[#a99cff]"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-[#1f1b36] rounded-2xl p-6 space-y-3 border border-white/5">

        {notifications.length === 0 && (
          <p className="text-center text-gray-400 py-10">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.is_read && markOneRead(n.id)}
            className="flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition cursor-pointer relative"
          >
            <div className="w-10 h-10 bg-[#2c274b] rounded-full flex items-center justify-center">
              {icon(n.type)}
            </div>

            <div className="flex-1">
              <p>{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {timeAgo(n.created_at)}
              </p>
            </div>

            {/* ⭐ unread dot */}
            {!n.is_read && (
              <div className="w-2 h-2 bg-[#8b7cf6] rounded-full absolute right-4 top-6"/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}