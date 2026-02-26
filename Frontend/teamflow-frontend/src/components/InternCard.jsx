// components/InternCard.jsx - Enhanced Version
import { Mail, Calendar, UserCheck, UserX } from "lucide-react";

export default function InternCard({ intern, onView }) {
  return (
    <div 
      onClick={() => onView(intern)}
      className="bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:scale-[1.02] hover:border-[#6c5ce7]/30 group/card relative overflow-hidden cursor-pointer"
    >

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/card:w-full transition-all duration-700"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/card:scale-150 transition-transform duration-700"></div>

      {/* Header with avatar */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center text-lg font-bold group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300 group-hover/card:shadow-lg group-hover/card:shadow-[#6c5ce7]/30">
            {intern.name?.[0]?.toUpperCase() || "I"}
          </div>
          <div>
            <h3 className="font-semibold group-hover/card:text-white transition-colors duration-300">
              {intern.name}
            </h3>
            <p className="text-sm text-gray-400 flex items-center gap-1 group-hover/card:text-gray-300 transition-colors duration-300">
              <Mail className="w-3 h-3" />
              {intern.email}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
          intern.team_lead_id 
            ? "bg-green-500/20 text-green-400" 
            : "bg-yellow-500/20 text-yellow-400"
        } group-hover/card:scale-105 transition-transform duration-300`}>
          {intern.team_lead_id ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
          {intern.team_lead_id ? "Assigned" : "Unassigned"}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 group-hover/card:text-gray-300 transition-colors duration-300">
          <Calendar className="w-4 h-4" />
          <span>Joined: {intern.created_at}</span>
        </div>

        {intern.team_lead_name && (
          <p className="text-sm text-gray-400 group-hover/card:text-gray-300 transition-colors duration-300">
            Team Lead: <span className="text-[#8b7cf6]">{intern.team_lead_name}</span>
          </p>
        )}
      </div>

      {/* View details indicator */}
      <div className="mt-4 flex justify-end relative z-10">
        <span className="text-xs text-[#8b7cf6] flex items-center gap-1 group-hover/card:gap-2 transition-all duration-300">
          View Details
          <span className="group-hover/card:translate-x-1 transition-transform duration-300">→</span>
        </span>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
}