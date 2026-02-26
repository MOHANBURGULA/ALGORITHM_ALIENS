import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Bell,
  CheckCheck,
  Clock,
  Inbox,
  MessageCircle,
  FolderPlus,
  CheckCircle,
  X
} from "lucide-react";

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  /* ⭐ FETCH */
  const fetchNotes = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/notifications",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* ⭐ MARK SINGLE READ */
  const markRead = async (id) => {
    await axios.put(
      `http://localhost:5000/api/notifications/read/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    fetchNotes();
  };

  /* ⭐ MARK ALL READ */
  const markAllRead = async () => {
    await Promise.all(
      notes
        .filter((n) => !n.is_read)
        .map((n) =>
          axios.put(
            `http://localhost:5000/api/notifications/read/${n.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          )
        )
    );

    fetchNotes();
  };

  /* ⭐ ICON FIX */
  const getIcon = (type) => {
    switch(type) {
      case "PROJECT_ASSIGNED":
        return <FolderPlus className="w-4 h-4" />;
      case "FEEDBACK":
        return <MessageCircle className="w-4 h-4" />;
      case "PROJECT_COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = notes.filter(n => !n.is_read).length;

  if (!notes.length) return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Notifications
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Stay updated with your latest activities
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 p-12 text-center">
        <div className="w-20 h-20 bg-[#2c274b] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">All caught up!</h2>
        <p className="text-gray-400">No notifications yet</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-[#8b7cf6]/20 text-[#8b7cf6] rounded-full border border-[#8b7cf6]/30 animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Stay updated with your latest activities
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="group flex items-center gap-2 px-4 py-2 bg-[#2c274b] hover:bg-[#322d52] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 text-[#8b7cf6] hover:text-[#a99cff]"
              >
                <CheckCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        
        {/* List Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1f1b36]/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#8b7cf6]" />
            <span className="text-sm font-medium">Notification Center</span>
          </div>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {notes.length} total
          </span>
        </div>

        {/* Notifications */}
        <div className="divide-y divide-white/5">
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`
                group relative p-5 transition-all duration-300 cursor-pointer
                ${!n.is_read 
                  ? 'bg-[#2c274b] hover:bg-[#352f57]' 
                  : 'bg-[#1f1b36] hover:bg-[#2a2445]'
                }
                hover:pl-6 border-l-2 border-l-transparent hover:border-l-[#8b7cf6]
              `}
            >
              <div className="flex gap-4 items-start">
                {/* Icon with animation */}
                <div className={`
                  relative p-2.5 rounded-xl transition-all duration-300
                  ${!n.is_read 
                    ? 'bg-[#8b7cf6]/20 group-hover:bg-[#8b7cf6]/30' 
                    : 'bg-white/5 group-hover:bg-white/10'
                  }
                `}>
                  <Bell 
                    size={18} 
                    className={`
                      transition-all duration-300
                      ${!n.is_read 
                        ? 'text-[#8b7cf6] group-hover:scale-110' 
                        : 'text-gray-400 group-hover:text-gray-300'
                      }
                    `} 
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className={`
                        font-medium transition-colors
                        ${!n.is_read ? 'text-white' : 'text-gray-300'}
                      `}>
                        {n.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">
                          {new Date(n.created_at).toLocaleString("en-GB", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status indicators */}
                    <div className="flex items-center gap-3">
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
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b7cf6]/0 to-[#8b7cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer with timestamp */}
      {notes.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
}