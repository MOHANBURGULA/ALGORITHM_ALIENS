import { User } from "lucide-react";

export default function InternCard({ intern, onView }) {
  const assigned = !!intern.team_lead_id;

  return (
    <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-[#6c5ce7]/40 transition">

      {/* ⭐ HEADER */}
      <div className="flex items-start justify-between gap-2">

        <div className="flex gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#6c5ce7] flex items-center justify-center font-semibold text-lg shrink-0">
            {intern.name?.[0]}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold truncate">{intern.name}</h3>
            <p className="text-gray-400 text-sm truncate">{intern.email}</p>
          </div>
        </div>

        {/* ⭐ STATUS BADGE */}
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium border shrink-0 whitespace-nowrap ${
            assigned
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {assigned ? "assigned" : "unassigned"}
        </span>
      </div>

      {/* ⭐ DETAILS */}
      <div className="mt-4 text-sm text-gray-300 space-y-2">
        <p className="flex gap-2 items-center">
          <User size={14} />
          Team Lead: {intern.team_lead_name || "Not Assigned"}
        </p>
      </div>

      {/* ⭐ BUTTON */}
      <button
        onClick={() => onView(intern)}
        className="w-full mt-5 bg-[#2c274b] hover:bg-[#6c5ce7] transition rounded-xl py-2"
      >
        View Details
      </button>
    </div>
  );
}