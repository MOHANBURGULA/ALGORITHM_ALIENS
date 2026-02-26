import { useEffect, useState } from "react";
import api from "../../api/axios";
import InternCard from "./components/InternCard";
import InternDetailsModal from "./components/InternDetailsModal";

export default function HrInterns() {
  const [interns, setInterns] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedIntern, setSelectedIntern] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/hr/interns");
      setInterns(res.data);
    };
    fetch();
  }, []);

  /* ⭐ FILTER LOGIC */
  const filtered = interns.filter((i) => {
    if (filter === "ASSIGNED") return i.team_lead_id;
    if (filter === "UNASSIGNED") return !i.team_lead_id;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ⭐ HEADER with enhanced animations */}
      <div className="flex justify-between items-center group/header">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
            Intern Management
          </h1>
          <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
            Manage all interns and their assignments
          </p>
        </div>

        {/* ⭐ ENHANCED FILTER BUTTONS */}
        <div className="flex gap-2">
          <FilterBtn
            text={`All (${interns.length})`}
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          />
          <FilterBtn
            text={`Assigned (${interns.filter((i) => i.team_lead_id).length})`}
            active={filter === "ASSIGNED"}
            onClick={() => setFilter("ASSIGNED")}
          />
          <FilterBtn
            text={`Unassigned (${interns.filter((i) => !i.team_lead_id).length})`}
            active={filter === "UNASSIGNED"}
            onClick={() => setFilter("UNASSIGNED")}
          />
        </div>
      </div>

      {/* ⭐ GRID with staggered animation */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400 py-12 group/empty">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#2c274b] flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-300">
              <span className="text-3xl">👤</span>
            </div>
            <p className="group-hover/empty:text-gray-300 transition-colors duration-300">
              No interns found for this filter
            </p>
            <button
              onClick={() => setFilter("ALL")}
              className="mt-4 text-sm text-[#8b7cf6] hover:underline"
            >
              View all interns →
            </button>
          </div>
        ) : (
          filtered.map((i, index) => (
            <div
              key={i.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slideUp"
            >
              <InternCard
                intern={{
                  ...i,
                  created_at: new Date(i.created_at).toLocaleDateString("en-GB"),
                }}
                onView={(intern) => setSelectedIntern(intern)}
              />
            </div>
          ))
        )}
      </div>

      {/* ⭐ ENHANCED MODAL - will be handled in InternDetailsModal component */}
      <InternDetailsModal
        intern={selectedIntern}
        onClose={() => setSelectedIntern(null)}
      />
    </div>
  );
}

/* ⭐ ENHANCED FILTER BTN with professional animations */
function FilterBtn({ text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-xl transition-all duration-300 overflow-hidden group/btn ${
        active
          ? "bg-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/30 scale-105"
          : "bg-[#1f1b36] hover:bg-[#2c274b] hover:scale-105 hover:shadow-lg hover:shadow-[#6c5ce7]/10"
      }`}
    >

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

      {/* Button text with count */}
      <span className="relative z-10 flex items-center gap-1">
        {text.split('(')[0]}
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
          active 
            ? "bg-white/20" 
            : "bg-[#2c274b] group-hover/btn:bg-[#1f1b36]"
        } transition-colors duration-300`}>
          {text.match(/\((\d+)\)/)?.[1]}
        </span>
      </span>

      {/* Active indicator dot */}
      {active && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse"></span>
      )}
    </button>
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

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}
*/