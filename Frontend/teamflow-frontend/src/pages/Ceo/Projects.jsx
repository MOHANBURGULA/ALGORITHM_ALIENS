import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get("/ceo/project-progress");
    setProjects(res.data);
  };

  const openDetails = async (id) => {
    const res = await api.get(`/ceo/project-details/${id}`);
    setDetails(res.data);
    setSelected(id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header with animated accent */}
      <div className="group/header">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#6c5ce7] rounded-full group-hover/header:h-8 transition-all duration-300"></span>
          All Projects
        </h2>
        <p className="text-gray-400 text-sm group-hover/header:translate-x-4 transition-transform duration-300">
          Track and manage all ongoing projects
        </p>
      </div>

      {/* Projects table container */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 border border-transparent hover:border-[#6c5ce7]/20 group/table relative overflow-hidden">

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/table:w-full transition-all duration-700"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/table:scale-150 transition-transform duration-700"></div>

        {/* Table Header */}
        <div className="grid grid-cols-6 text-gray-400 text-sm mb-4 pb-2 border-b border-white/5 relative z-10">
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Project</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Intern</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Team Lead</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Status</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Deadline</p>
          <p></p>
        </div>

        {/* Project Rows */}
        <div className="space-y-1 relative z-10">
          {projects.map((p, index) => (
            <div
              key={p.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="grid grid-cols-6 items-center py-3 border-b border-white/5 group/row hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 hover:shadow-lg rounded-lg px-2 animate-slideIn"
            >
              <p className="font-semibold group-hover/row:text-white transition-colors duration-300">
                {p.title}
              </p>
              <p className="group-hover/row:text-gray-300 transition-colors duration-300">{p.intern}</p>
              <p className="group-hover/row:text-gray-300 transition-colors duration-300">{p.teamlead}</p>

              <span className={`text-xs px-2 py-1 rounded-lg w-fit transition-all duration-300 group-hover/row:scale-105 ${
                p.status === "Completed"
                  ? "bg-green-500/20 text-green-400 group-hover/row:shadow-lg group-hover/row:shadow-green-500/20"
                  : "bg-yellow-500/20 text-yellow-400 group-hover/row:shadow-lg group-hover/row:shadow-yellow-500/20"
              }`}>
                {p.status}
              </span>

              <p className="group-hover/row:text-gray-300 transition-colors duration-300">
                {new Date(p.deadline).toLocaleDateString()}
              </p>

              <button
                onClick={() => openDetails(p.id)}
                className="text-sm text-[#8b7cf6] hover:underline relative group/btn overflow-hidden w-fit px-3 py-1 rounded-lg hover:bg-[#8b7cf6]/10 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1">
                  View
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#8b7cf6]/0 via-[#8b7cf6]/20 to-[#8b7cf6]/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ ENHANCED MODAL with professional animations */}
      {selected && details && (
        <div 
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-[#1f1b36] w-[900px] p-6 rounded-2xl border border-white/5 animate-scaleIn relative overflow-hidden group/modal"
            onClick={e => e.stopPropagation()}
          >

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c5ce7] via-[#8b7cf6] to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#6c5ce7]/10 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#8b7cf6]/10 rounded-full blur-3xl group-hover/modal:scale-150 transition-transform duration-700"></div>

            {/* Header with project title */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#6c5ce7] rounded-full animate-pulse"></span>
                  {details.project?.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {details.project?.description}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                ✕
              </button>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
              <Info label="Intern" value={details.project?.intern} delay={0.1} />
              <Info label="Team Lead" value={details.project?.teamlead} delay={0.2} />
              <Info
                label="Deadline"
                value={
                  details.project?.deadline
                    ? new Date(details.project.deadline).toLocaleDateString()
                    : "-"
                }
                delay={0.3}
              />
            </div>

            {/* Submissions Section */}
            <div className="relative z-10">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#8b7cf6] rounded-full"></span>
                Submissions
                <span className="text-xs text-gray-400">
                  ({details.submissions?.length || 0})
                </span>
              </h4>

              <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {details.submissions?.length === 0 && (
                  <div className="bg-[#2c274b] p-8 rounded-xl border border-white/5 text-center group/empty">
                    <p className="text-gray-400 text-sm group-hover/empty:text-gray-300 transition-colors duration-300">
                      No submissions yet
                    </p>
                  </div>
                )}

                {details.submissions?.map((s, index) => (
                  <div
                    key={s.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className="bg-[#2c274b] p-4 rounded-xl border border-white/5 space-y-2 hover:bg-[#332d52] transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#6c5ce7]/10 group/submission animate-slideIn relative overflow-hidden"
                  >

                    {/* Left accent bar */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-[#6c5ce7] to-[#8b7cf6] group-hover/submission:h-12 transition-all duration-300 rounded-r"></div>

                    <div className="flex justify-between relative z-10">
                      <p className="font-semibold group-hover/submission:text-white transition-colors duration-300">
                        {s.title}
                      </p>

                      <span className={`text-xs px-2 py-1 rounded-lg transition-all duration-300 group-hover/submission:scale-105 ${
                        s.status === "Approved"
                          ? "bg-green-500/20 text-green-400 group-hover/submission:shadow-lg group-hover/submission:shadow-green-500/20"
                          : s.status === "Rejected"
                          ? "bg-red-500/20 text-red-400 group-hover/submission:shadow-lg group-hover/submission:shadow-red-500/20"
                          : "bg-yellow-500/20 text-yellow-400 group-hover/submission:shadow-lg group-hover/submission:shadow-yellow-500/20"
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 group-hover/submission:text-gray-300 transition-colors duration-300">
                      Submitted: {new Date(s.submitted_at).toLocaleDateString()}
                    </p>

                    {s.feedback && (
                      <p className="text-xs text-gray-300 bg-black/20 p-2 rounded-lg">
                        <span className="text-[#8b7cf6]">Feedback:</span> {s.feedback}
                      </p>
                    )}

                    {/* ⭐ FIXED PDF PREVIEW with enhanced link */}
                    {s.pdf_url && (
                      <a
                        href={`http://localhost:5000/uploads/${s.pdf_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8b7cf6] hover:underline inline-flex items-center gap-1 group/link transition-all duration-300 hover:gap-2"
                      >
                        <span>📄</span>
                        View PDF
                        <span className="group/link:hover:translate-x-1 transition-transform duration-300">→</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
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
      )}
    </div>
  );
}

/* ⭐ ENHANCED Info component */
function Info({ label, value, delay = 0 }) {
  return (
    <div 
      style={{ animationDelay: `${delay}s` }}
      className="bg-[#2c274b] p-3 rounded-xl hover:bg-[#332d52] transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:shadow-[#6c5ce7]/10 group/info animate-slideIn relative overflow-hidden"
    >

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/info:translate-x-full transition-transform duration-1000"></div>

      <p className="text-gray-400 text-xs group-hover/info:text-[#8b7cf6] transition-colors duration-300">
        {label}
      </p>
      <p className="font-semibold group-hover/info:text-white transition-colors duration-300 relative z-10">
        {value}
      </p>
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #2c274b;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6c5ce7;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8b7cf6;
}
*/