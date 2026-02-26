import { Bell, ChevronDown, CheckCircle, Clock, Info, User, Search, X, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Navbar() {
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await api.get("/notifications");
        setNotifications(res1.data);
      } catch (e) {
        console.log("notifications fetch ignored");
      }

      try {
        const res2 = await api.get("/users/me");
        setUser(res2.data);
      } catch (e) {
        console.log("user fetch ignored");
      }
    };

    fetchData();
  }, []);

  // Function to mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      // Call API to mark as read
      await api.patch(`/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Call API to mark all as read
      await api.patch("/notifications/mark-all-read");
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // If notification is unread, mark it as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Close the notification dropdown
    setBellOpen(false);
    
    // Navigate based on notification type or data
    // You can customize this based on your notification structure
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.project_id) {
      navigate(`/projects/${notification.project_id}`);
    } else if (notification.submission_id) {
      navigate(`/submissions/${notification.submission_id}`);
    }
    // Add more navigation logic based on your needs
  };

  const initials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
  };

  const icon = (type, isRead) => {
    const color = isRead
      ? {
          success: "text-green-400",
          warning: "text-yellow-400",
          info: "text-blue-400"
        }[type] || "text-blue-400"
      : "text-gray-400";

    if (type === "success") return <CheckCircle className={color} size={18} />;
    if (type === "warning") return <Clock className={color} size={18} />;
    return <Info className={color} size={18} />;
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    return Math.floor(diff / 86400) + " days ago";
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="h-[80px] bg-[#14112a] border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl bg-[#14112a]/95">
      
      {/* Search Section */}
      <div className="relative">
        <div className={`
          flex items-center transition-all duration-300
          ${searchOpen ? 'w-[400px]' : 'w-[320px]'}
        `}>
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            placeholder="Search projects, submissions, interns..."
            className="w-full bg-[#1f1b36] pl-11 pr-4 py-3 rounded-xl outline-none border border-white/5 focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50 transition-all duration-300 text-sm text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="absolute left-0 right-0 top-14 bg-[#1f1b36] rounded-2xl border border-white/5 shadow-xl py-2 z-50">
            <p className="text-xs text-gray-400 px-4 py-2">No results found</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 relative">
        {/* Bell Icon - Enhanced */}
        <button 
          onClick={() => setBellOpen(!bellOpen)} 
          className="relative group"
        >
          <div className={`
            p-2 rounded-xl transition-all duration-300
            ${bellOpen 
              ? 'bg-[#8b7cf6]/20 text-[#8b7cf6]' 
              : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }
          `}>
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
          </div>
          {unreadCount > 0 && (
            <>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#8b7cf6] rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                {unreadCount}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#8b7cf6] rounded-full animate-ping opacity-75"></div>
            </>
          )}
        </button>

        {/* Notifications Dropdown - Enhanced */}
        {bellOpen && (
          <div className="absolute right-0 top-14 w-[380px] bg-[#1f1b36] rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-[#1f1b36]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-[#8b7cf6]" />
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                {unreadCount > 0 && (
                  <span className="text-xs bg-[#8b7cf6]/20 text-[#8b7cf6] px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No notifications</p>
                  <p className="text-xs text-gray-500 mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`
                        flex items-start gap-3 p-4 cursor-pointer relative
                        transition-all duration-300 hover:bg-white/5
                        ${!n.is_read ? 'bg-[#8b7cf6]/5' : ''}
                      `}
                    >
                      {/* Icon */}
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${!n.is_read ? 'bg-[#8b7cf6]/10' : 'bg-[#2c274b]'}
                      `}>
                        {icon(n.type, n.is_read)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!n.is_read && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-[#8b7cf6]">New</span>
                          <div className="w-2 h-2 rounded-full bg-[#8b7cf6] animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-3 border-t border-white/5 bg-[#1f1b36]/50">
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-xs text-center text-[#8b7cf6] hover:text-white transition-colors py-1"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        )}

        <AvatarDropdown user={user} initials={initials} />
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8b7cf6;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6c5ce7;
        }
      `}</style>
    </div>
  );
}

/* Enhanced Avatar Dropdown */
function AvatarDropdown({ user, initials }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /* Role Based Profile Route */
  const goProfile = () => {
    if (!user) return;
    setOpen(false);

    if (user.role === "CEO") navigate("/ceo/profile");
    else if (user.role === "HR") navigate("/hr/profile");
    else if (user.role === "TEAM_LEAD") navigate("/teamlead/profile");
    else navigate("/intern/profile");
  };

  const goToSettings = () => {
    if (!user) return;
    setOpen(false);
    
    if (user.role === "CEO") navigate("/ceo/settings");
    else if (user.role === "HR") navigate("/hr/settings");
    else if (user.role === "TEAM_LEAD") navigate("/teamlead/settings");
    else navigate("/intern/settings");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center font-semibold shadow-lg group-hover:scale-110 transition-transform duration-300">
          {initials(user?.name)}
        </div>

        <div className="text-left hidden md:block">
          <p className="text-sm font-semibold group-hover:text-[#8b7cf6] transition-colors">
            {user?.name}
          </p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>

        <ChevronDown 
          size={16} 
          className={`
            text-gray-400 transition-all duration-300
            ${open ? 'rotate-180' : ''}
            group-hover:text-white
          `}
        />
      </div>

      {open && (
        <div className="absolute right-0 top-12 w-[280px] bg-[#1f1b36] rounded-2xl border border-white/5 shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
          
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-r from-[#6c5ce7]/10 to-[#8b7cf6]/10 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center text-lg font-bold shadow-lg">
                {initials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <p className="text-xs text-[#8b7cf6] mt-1">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Profile Settings */}
            <button
              onClick={goProfile}
              className="w-full flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
            >
              <div className="p-2 bg-[#2c274b] rounded-lg group-hover:scale-110 transition-transform">
                <User size={16} className="text-[#8b7cf6]" />
              </div>
              <span className="flex-1 text-left text-white">Profile Settings</span>
              <ChevronDown size={14} className="rotate-[-90deg] text-gray-500" />
            </button>

            {/* Settings */}
            <button
              onClick={goToSettings}
              className="w-full flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
            >
              <div className="p-2 bg-[#2c274b] rounded-lg group-hover:scale-110 transition-transform">
                <Settings size={16} className="text-[#8b7cf6]" />
              </div>
              <span className="flex-1 text-left text-white">Settings</span>
              <ChevronDown size={14} className="rotate-[-90deg] text-gray-500" />
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-white/5"></div>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 hover:bg-red-500/10 p-3 rounded-xl transition-all duration-300 group"
            >
              <div className="p-2 bg-[#2c274b] rounded-lg group-hover:scale-110 transition-transform group-hover:bg-red-500/20">
                <LogOut size={16} className="text-red-400" />
              </div>
              <span className="flex-1 text-left text-red-400">Log Out</span>
              <ChevronDown size={14} className="rotate-[-90deg] text-gray-500" />
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white/5 text-center">
            <p className="text-xs text-gray-500">Logged in as {user?.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}