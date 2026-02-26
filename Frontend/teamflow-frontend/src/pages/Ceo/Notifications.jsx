import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckCircle, Clock, Info, X } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  const openNotification = async (n) => {
    setSelected(n);

    if (!n.is_read) {
      await api.put(`/notifications/read/${n.id}`);
      fetchNotifications();
    }
  };

  const icon = (type, isRead) => {
    const color = isRead
      ? {
          success: "text-green-400",
          warning: "text-yellow-400",
          info: "text-blue-400"
        }[type] || "text-blue-400"
      : "text-gray-400"; // ⭐ unread color

    if (type === "success") return <CheckCircle className={`${color} transition-transform duration-300`} />;
    if (type === "warning") return <Clock className={`${color} transition-transform duration-300`} />;
    return <Info className={`${color} transition-transform duration-300`} />;
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    return Math.floor(diff / 86400) + " days ago";
  };

  const markAll = async () => {
    await Promise.all(
      notifications
        .filter(n => !n.is_read)
        .map(n => api.put(`/notifications/read/${n.id}`))
    );
    fetchNotifications();
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* header with enhanced animations */}
      <div className="flex justify-between items-center group/header">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
            Notifications
          </h2>
          <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
            Stay updated with your latest activities
          </p>
        </div>

        <button
          onClick={markAll}
          className="text-[#8b7cf6] hover:underline text-sm relative group/btn overflow-hidden px-3 py-1 rounded-lg hover:bg-[#8b7cf6]/10 transition-all duration-300"
        >
          <span className="relative z-10">Mark all as read</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#8b7cf6]/0 via-[#8b7cf6]/20 to-[#8b7cf6]/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></span>
        </button>
      </div>

      {/* notifications list with staggered animation */}
      <div className="bg-[#1f1b36] p-4 rounded-2xl space-y-4 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 border border-transparent hover:border-[#6c5ce7]/20 group/list">
        
        {/* decorative header line */}
        <div className="h-1 w-20 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full mb-4 group-hover/list:w-32 transition-all duration-500"></div>

        {notifications.map((n, index) => (
          <div
            key={n.id}
            onClick={() => openNotification(n)}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="group/item flex items-start gap-4 p-4 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer relative animate-slideIn transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6c5ce7]/10"
          >
            {/* icon container with enhanced effects */}
            <div className="w-10 h-10 rounded-full bg-[#2c274b] flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300 group-hover/item:shadow-lg group-hover/item:shadow-[#6c5ce7]/20">
              {icon(n.type, n.is_read)}
            </div>

            {/* content with hover effects */}
            <div className="flex-1">
              <p className="font-semibold group-hover/item:text-white transition-colors duration-300">
                {n.title}
              </p>
              <p className="text-gray-400 text-sm group-hover/item:text-gray-300 transition-colors duration-300">
                {n.message}
              </p>
              <p className="text-xs text-gray-500 mt-1 group-hover/item:text-gray-400 transition-colors duration-300">
                {timeAgo(n.created_at)}
              </p>
            </div>

            {/* unread indicator with pulse animation */}
            {!n.is_read && (
              <div className="absolute right-4 top-5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b7cf6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8b7cf6]"></span>
                </span>
              </div>
            )}

            {/* hover gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6c5ce7]/0 via-[#6c5ce7]/5 to-[#8b7cf6]/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center text-gray-400 py-6 group/empty animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c274b] flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-300">
              <Info className="w-8 h-8 text-gray-500" />
            </div>
            <p className="group-hover/empty:text-gray-300 transition-colors duration-300">
              No notifications
            </p>
          </div>
        )}
      </div>

      {/* ⭐ ENHANCED MODAL with professional animations */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-[#1f1b36] w-[500px] p-6 rounded-2xl border border-white/5 animate-scaleIn relative overflow-hidden group/modal"
            onClick={e => e.stopPropagation()}
          >

            {/* decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c5ce7] via-[#8b7cf6] to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-1 h-6 bg-[#6c5ce7] rounded-full animate-pulse"></span>
                {selected.title}
              </h3>
              <button 
                onClick={() => setSelected(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 relative z-10">{selected.message}</p>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
              <p className="text-xs text-gray-500">
                {new Date(selected.created_at).toLocaleString()}
              </p>
              
              {/* notification type indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Type:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selected.type === 'success' ? 'bg-green-500/20 text-green-400' :
                  selected.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {selected.type}
                </span>
              </div>
            </div>

            {/* close indicator */}
            <p className="text-[10px] text-gray-600 text-center mt-4">
              Click outside to close
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

/* ⭐ Add these styles to your global CSS file */
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
*/