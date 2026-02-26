// components/InternDetailsModal.jsx - Enhanced Version
import { X, Mail, Calendar, User, Briefcase, CheckCircle, XCircle } from "lucide-react";

export default function InternDetailsModal({ intern, onClose }) {
  if (!intern) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#1f1b36] w-[500px] p-6 rounded-2xl border border-white/5 animate-scaleIn relative overflow-hidden group/modal"
        onClick={e => e.stopPropagation()}
      >

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c5ce7] via-[#8b7cf6] to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#6c5ce7]/10 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#8b7cf6]/10 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center text-xl font-bold">
              {intern.name?.[0]?.toUpperCase() || "I"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{intern.name}</h2>
              <p className="text-sm text-gray-400">Intern Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 relative z-10">
          <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={intern.email} />
          <DetailRow 
            icon={<Calendar className="w-4 h-4" />} 
            label="Joined" 
            value={new Date(intern.created_at).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} 
          />
          <DetailRow 
            icon={<User className="w-4 h-4" />} 
            label="Status" 
            value={intern.team_lead_id ? "Assigned" : "Unassigned"}
            valueClassName={intern.team_lead_id ? "text-green-400" : "text-yellow-400"}
          />
          
          {intern.team_lead_name && (
            <DetailRow 
              icon={<Briefcase className="w-4 h-4" />} 
              label="Team Lead" 
              value={intern.team_lead_name}
              valueClassName="text-[#8b7cf6]"
            />
          )}
        </div>

        {/* Assignment History Section (if available) */}
        {intern.assignments && intern.assignments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#6c5ce7] rounded-full"></span>
              Assignment History
            </h3>
            <div className="space-y-2">
              {intern.assignments.map((assignment, index) => (
                <div 
                  key={index}
                  className="bg-[#2c274b] p-3 rounded-lg text-sm hover:bg-[#332d52] transition-all duration-300"
                >
                  <p className="text-gray-300">{assignment.team_lead}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(assignment.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] group/close relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Close
            <span className="group/close:hover:rotate-90 transition-transform duration-300">✕</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group/close:hover:translate-x-full transition-transform duration-1000"></span>
        </button>

      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, valueClassName = "text-white" }) {
  return (
    <div className="flex items-start gap-3 group/row">
      <div className="w-8 h-8 rounded-lg bg-[#2c274b] flex items-center justify-center group-hover/row:scale-110 group-hover/row:bg-[#6c5ce7]/20 transition-all duration-300">
        <span className="text-gray-400 group-hover/row:text-[#8b7cf6] transition-colors duration-300">
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 group-hover/row:text-[#8b7cf6] transition-colors duration-300">
          {label}
        </p>
        <p className={`font-semibold group-hover/row:translate-x-1 transition-transform duration-300 ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* Add to your global CSS if not already present */
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

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
*/