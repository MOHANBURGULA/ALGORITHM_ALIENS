import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
    };
    fetch();
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6c5ce7] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-[700px] mx-auto animate-fadeIn">

      {/* Header with animated accent */}
      <div className="group/header mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
          Profile Settings
        </h2>
        <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
          Manage your personal information
        </p>
      </div>

      {/* Profile card with enhanced animations */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl space-y-4 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 group/profile relative overflow-hidden">

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/profile:w-full transition-all duration-700"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/profile:scale-150 transition-transform duration-700"></div>
        
        {/* Profile avatar/icon */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center text-2xl font-bold group-hover/profile:scale-110 group-hover/profile:rotate-3 transition-all duration-300 group-hover/profile:shadow-lg group-hover/profile:shadow-[#6c5ce7]/30">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="text-xl font-semibold group-hover/profile:text-white transition-colors duration-300">
              {user.name}
            </p>
          </div>
        </div>

        {/* Profile fields with staggered animation */}
        <Field 
          label="Name" 
          value={user.name}
          icon="👤"
          delay={0.1}
        />
        <Field 
          label="Email" 
          value={user.email}
          icon="📧"
          delay={0.2}
        />
        <Field 
          label="Role" 
          value={user.role}
          icon="💼"
          delay={0.3}
        />
        <Field 
          label="Joined" 
          value={new Date(user.created_at).toLocaleDateString()}
          icon="📅"
          delay={0.4}
        />

        {/* Edit hint (visual enhancement only) */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
          <p className="text-xs text-gray-500 group-hover/profile:text-gray-400 transition-colors duration-300">
            Contact admin to update your information
          </p>
        </div>

      </div>
    </div>
  );
}

/* ⭐ ENHANCED Field component with professional animations */
function Field({ label, value, icon, delay = 0 }) {
  return (
    <div 
      style={{ animationDelay: `${delay}s` }}
      className="group/field bg-[#2c274b] p-4 rounded-xl hover:bg-[#332d52] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6c5ce7]/10 animate-slideIn relative overflow-hidden cursor-default"
    >

      {/* Left accent bar that animates on hover */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-[#6c5ce7] to-[#8b7cf6] group-hover/field:h-8 transition-all duration-300 rounded-r"></div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/field:translate-x-full transition-transform duration-1000"></div>
      
      {/* Content with icon */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-sm opacity-50 group-hover/field:opacity-100 group-hover/field:scale-110 transition-all duration-300">
              {icon}
            </span>
          )}
          <p className="text-xs text-gray-400 group-hover/field:text-[#8b7cf6] transition-colors duration-300">
            {label}
          </p>
        </div>
      </div>

      {/* Value with enhanced hover effect */}
      <p className="font-semibold mt-1 group-hover/field:translate-x-2 transition-transform duration-300 relative z-10">
        {value}
      </p>

      {/* Copy hint (appears on hover) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300">
        <span className="text-xs text-[#8b7cf6]">📋</span>
      </div>

    </div>
  );
}

/* ⭐ Add these styles to your global CSS file (if not already added) */
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

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}
*/