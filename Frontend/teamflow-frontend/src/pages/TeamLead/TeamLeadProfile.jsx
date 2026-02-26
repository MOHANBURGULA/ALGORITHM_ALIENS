import { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  User, 
  Mail, 
  BadgeCheck, 
  Calendar, 
  Edit2, 
  Shield, 
  Award,
  Sparkles,
  Clock,
  MapPin
} from "lucide-react";

export default function TeamLeadProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
    };
    fetch();
  }, []);

  if (!user) return (
    <div className="max-w-[700px] mx-auto p-4">
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-20 h-20 rounded-full bg-[#2c274b] animate-pulse mb-4"></div>
          <div className="h-4 w-48 bg-[#2c274b] animate-pulse rounded mb-3"></div>
          <div className="h-3 w-32 bg-[#2c274b] animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'teamlead':
        return <Award className="w-4 h-4" />;
      case 'intern':
        return <User className="w-4 h-4" />;
      default:
        return <BadgeCheck className="w-4 h-4" />;
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'TL';
  };

  const getMemberSince = (date) => {
    const joined = new Date(date);
    const now = new Date();
    const years = now.getFullYear() - joined.getFullYear();
    return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : 'Less than a year';
  };

  return (
    <div className="max-w-[700px] mx-auto p-4">
      {/* Header with decorative element */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h2 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Profile Settings
          </h2>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        
        {/* Profile Header with Avatar */}
        <div className="relative h-32 bg-gradient-to-r from-[#8b7cf6]/10 to-transparent">
          <div className="absolute -bottom-12 left-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-[#2c274b] border-4 border-[#1f1b36] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl font-bold text-[#8b7cf6]">
                  {getInitials(user.name)}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#8b7cf6] rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#a99cff] shadow-lg">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* User Info Summary */}
        <div className="pt-16 px-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <span className="px-2 py-0.5 bg-[#8b7cf6]/20 text-[#8b7cf6] rounded-full text-xs font-medium flex items-center gap-1">
              {getRoleIcon(user.role)}
              {user.role}
            </span>
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>
          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Member for {getMemberSince(user.created_at)}
          </p>
        </div>

        {/* Profile Fields */}
        <div className="p-6 space-y-4">
          <Field 
            icon={<User className="w-4 h-4" />}
            label="Full Name" 
            value={user.name}
            delay={0}
          />
          <Field 
            icon={<Mail className="w-4 h-4" />}
            label="Email Address" 
            value={user.email}
            delay={100}
          />
          <Field 
            icon={getRoleIcon(user.role)}
            label="Account Type" 
            value={user.role}
            delay={200}
          />
          <Field 
            icon={<Calendar className="w-4 h-4" />}
            label="Member Since" 
            value={new Date(user.created_at).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            delay={300}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#1f1b36]/50 border-t border-white/5 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-[#2c274b] hover:bg-[#322d52] rounded-xl transition-all duration-300 border border-white/5 hover:border-white/10">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-[#8b7cf6] hover:bg-[#7b6de6] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Additional Info Card - Team Lead Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Security Card */}
        <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account Security
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm">Account status: Active</span>
            </div>
            <button className="text-xs text-[#8b7cf6] hover:text-[#a99cff] transition-colors">
              Change Password →
            </button>
          </div>
        </div>

        {/* Team Lead Stats Card */}
        <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Team Lead Stats
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Projects Managed</p>
              <p className="text-lg font-semibold text-[#8b7cf6]">12</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Team Members</p>
              <p className="text-lg font-semibold text-[#8b7cf6]">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mt-6 bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg p-6">
        <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-gray-300">Approved 3 submissions</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-gray-300">Created new project</span>
            <span className="text-xs text-gray-500 ml-auto">Yesterday</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-gray-300">Added team member</span>
            <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ⭐ ENHANCED FIELD COMPONENT */
function Field({ icon, label, value, delay = 0 }) {
  return (
    <div 
      className="group bg-[#2c274b] p-5 rounded-xl hover:bg-[#322d52] transition-all duration-300 hover:shadow-lg border border-transparent hover:border-white/5 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-[#1f1b36] rounded-lg group-hover:scale-110 group-hover:bg-[#8b7cf6]/10 transition-all duration-300">
          <div className="text-[#8b7cf6]">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors mb-1">
            {label}
          </p>
          <p className="font-semibold text-lg group-hover:text-white transition-colors">
            {value}
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8b7cf6]"></div>
        </div>
      </div>
    </div>
  );
}