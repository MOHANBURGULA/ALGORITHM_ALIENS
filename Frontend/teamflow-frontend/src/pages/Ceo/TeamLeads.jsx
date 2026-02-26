import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TeamLeads() {
  const [teamLeads, setTeamLeads] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedTL, setSelectedTL] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState("");

  useEffect(() => {
    fetchTL();
    fetchInterns();
  }, []);

  const fetchTL = async () => {
    const res = await api.get("/ceo/team-leads");
    setTeamLeads(res.data);
  };

  const fetchInterns = async () => {
    const res = await api.get("/ceo/interns");
    setInterns(res.data);
  };

  const assign = async () => {
    await api.put("/ceo/assign-teamlead", {
      internId: selectedIntern,
      teamLeadId: selectedTL,
    });
    fetchTL();
    setSelectedTL(null);
  };

  return (
    <div id="teamleads" className="p-8 grid grid-cols-3 gap-6 animate-fadeIn">
      {teamLeads.map((tl, index) => (
        <div
          key={tl.id}
          style={{ animationDelay: `${index * 0.1}s` }}
          className="group/card bg-[#1f1b36] rounded-2xl p-8 shadow-lg border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/20 transition-all duration-500 hover:scale-[1.02] hover:border-[#6c5ce7]/30 animate-slideUp relative overflow-hidden"
        >

          {/* Background gradient effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c5ce7]/0 via-[#6c5ce7]/5 to-[#8b7cf6]/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/card:w-full transition-all duration-500"></div>

          {/* ⭐ FIXED HEADER with enhanced animations */}
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center text-lg font-bold group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300 group-hover/card:shadow-lg group-hover/card:shadow-[#6c5ce7]/30">
                {tl.name[0]}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold truncate group-hover/card:text-white transition-colors duration-300">
                  {tl.name}
                </h2>
                <p className="text-gray-400 text-sm truncate group-hover/card:text-gray-300 transition-colors duration-300">
                  {tl.email}
                </p>
              </div>
            </div>

            {/* ⭐ FIXED BADGE with pulse animation */}
            <span className="shrink-0 text-xs px-3 py-1 rounded-lg bg-green-500/20 text-green-400 whitespace-nowrap relative overflow-hidden group/badge">
              <span className="relative z-10">Active</span>
              <span className="absolute inset-0 bg-green-400/20 animate-pulse"></span>
            </span>
          </div>

          {/* Stats with enhanced hover effects */}
          <div className="flex justify-between mt-8 text-sm relative z-10">
            <div className="group/stat text-center hover:scale-110 transition-transform duration-300">
              <p className="text-gray-400 group-hover/stat:text-[#8b7cf6] transition-colors duration-300">Interns</p>
              <p className="font-semibold text-lg group-hover/stat:scale-110 transition-transform duration-300">
                {tl.interns}
              </p>
            </div>

            <div className="group/stat text-center hover:scale-110 transition-transform duration-300">
              <p className="text-gray-400 group-hover/stat:text-[#8b7cf6] transition-colors duration-300">Projects</p>
              <p className="font-semibold text-lg group-hover/stat:scale-110 transition-transform duration-300">
                {tl.projects}
              </p>
            </div>

            <div className="group/stat text-center hover:scale-110 transition-transform duration-300">
              <p className="text-gray-400 group-hover/stat:text-[#8b7cf6] transition-colors duration-300">Completion</p>
              <p className="font-semibold text-lg group-hover/stat:scale-110 transition-transform duration-300">
                {tl.completionrate}%
              </p>
            </div>
          </div>

          {/* Progress bar (optional enhancement) */}
          <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full transition-all duration-700"
              style={{ width: `${tl.completionrate}%` }}
            ></div>
          </div>

          {/* Enhanced button with animations */}
          <button
            onClick={() => setSelectedTL(tl.id)}
            className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] relative overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-[#6c5ce7]/30 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center justify-center gap-2">
              Assign / Reassign
              <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>
      ))}

      {/* ⭐ ENHANCED Assign Modal with professional animations */}
      {selectedTL && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedTL(null)}
        >
          <div 
            className="bg-[#1f1b36] p-6 rounded-xl w-80 border border-white/5 animate-scaleIn relative overflow-hidden group/modal"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6]"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/10 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>
            
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center">
                👤
              </div>
              <h3 className="font-semibold text-lg">Assign Intern to Team Lead</h3>
            </div>

            {/* Enhanced select dropdown */}
            <div className="relative z-10 group/select">
              <select
                className="mt-2 w-full p-3 rounded-lg bg-[#2c274b] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] cursor-pointer appearance-none"
                onChange={(e) => setSelectedIntern(e.target.value)}
                value={selectedIntern}
              >
                <option value="" className="bg-[#2c274b]">Select Intern</option>
                {interns.map((i) => (
                  <option key={i.id} value={i.id} className="bg-[#2c274b]">
                    {i.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7cf6] pointer-events-none">
                ▼
              </div>
            </div>

            {/* Action buttons with enhanced animations */}
            <div className="flex gap-2 mt-6 relative z-10">
              <button
                onClick={assign}
                disabled={!selectedIntern}
                className={`flex-1 py-2 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] relative overflow-hidden group/assign transition-all duration-300 ${
                  !selectedIntern ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#6c5ce7]/30 hover:scale-[1.02]'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/assign:translate-x-full transition-transform duration-1000"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Assign
                  <span className="group-hover/assign:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>

              <button
                onClick={() => setSelectedTL(null)}
                className="flex-1 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] group/cancel"
              >
                <span className="flex items-center justify-center gap-2">
                  Cancel
                  <span className="group-hover/cancel:rotate-90 transition-transform duration-300">✕</span>
                </span>
              </button>
            </div>

            {/* Close hint */}
            <p className="text-[10px] text-gray-600 text-center mt-4">
              Click outside to close
            </p>
          </div>
        </div>
      )}
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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

.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
*/