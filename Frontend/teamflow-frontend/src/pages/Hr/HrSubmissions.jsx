import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Eye, Download } from "lucide-react";

export default function HrSubmissions() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/hr/submissions");
      setData(res.data);
    };
    fetch();
  }, []);

  const filtered = data.filter(i => {
    if (filter === "PENDING") return i.status === "Pending";
    if (filter === "APPROVED") return i.status === "Approved";
    if (filter === "REJECTED") return i.status === "Rejected";
    return true;
  });

  const format = (d) => new Date(d).toLocaleDateString("en-GB");

  /* ⭐ FILE PREVIEW */
  const preview = (file) => {
    if (!file) return;
    const url = `http://localhost:5000/uploads/${file}`;
    window.open(url, "_blank");
  };

  /* ⭐ FILE DOWNLOAD */
  const download = (file) => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = `http://localhost:5000/uploads/${file}`;
    link.download = file;
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header with enhanced animations */}
      <div className="flex justify-between items-center group/header">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
            Submission Tracking
          </h1>
          <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
            Monitor all intern submissions and their status
          </p>
        </div>

        {/* Enhanced filter buttons */}
        <div className="flex gap-2">
          <Btn t="All" a={filter === "ALL"} f={() => setFilter("ALL")} count={data.length} />
          <Btn 
            t="Pending" 
            a={filter === "PENDING"} 
            f={() => setFilter("PENDING")} 
            count={data.filter(i => i.status === "Pending").length}
          />
          <Btn 
            t="Approved" 
            a={filter === "APPROVED"} 
            f={() => setFilter("APPROVED")} 
            count={data.filter(i => i.status === "Approved").length}
          />
          <Btn 
            t="Rejected" 
            a={filter === "REJECTED"} 
            f={() => setFilter("REJECTED")} 
            count={data.filter(i => i.status === "Rejected").length}
          />
        </div>
      </div>

      {/* Table container with enhanced effects */}
      <div className="bg-[#1f1b36] rounded-2xl p-6 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 group/table relative overflow-hidden">

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/table:w-full transition-all duration-700"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/table:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#8b7cf6]/5 rounded-full blur-3xl group-hover/table:scale-150 transition-transform duration-700"></div>

        <table className="w-full text-sm relative z-10">
          <thead className="text-gray-400">
            <tr className="border-b border-white/5">
              <th className="py-3 text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Intern</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Team Lead</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Project</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Submitted</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Files</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Status</th>
              <th className="text-left group-hover/table:text-[#8b7cf6] transition-colors duration-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <div className="group/empty">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c274b] flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-gray-400 group-hover/empty:text-gray-300 transition-colors duration-300">
                      No submissions found for this filter
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((i, index) => (
                <tr 
                  key={i.id} 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg group/row animate-slideIn"
                >
                  <td className="py-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full flex items-center justify-center font-bold group-hover/row:scale-110 group-hover/row:rotate-3 transition-all duration-300 group-hover/row:shadow-lg group-hover/row:shadow-[#6c5ce7]/30">
                        {i.intern_name?.[0]?.toUpperCase() || "I"}
                      </div>
                      <span className="group-hover/row:text-white transition-colors duration-300">
                        {i.intern_name}
                      </span>
                    </div>
                  </td>

                  <td className="group-hover/row:text-gray-300 transition-colors duration-300">
                    {i.team_lead_name || "—"}
                  </td>

                  <td className="group-hover/row:text-gray-300 transition-colors duration-300">
                    {i.project}
                  </td>

                  <td className="group-hover/row:text-gray-300 transition-colors duration-300">
                    {format(i.submitted_at)}
                  </td>

                  <td>
                    {i.pdf_url ? (
                      <span className="text-xs bg-[#2c274b] px-2 py-1 rounded-lg group-hover/row:bg-[#332d52] transition-all duration-300">
                        📄 PDF
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs border transition-all duration-300 group-hover/row:scale-105 inline-block ${
                      i.status === "Approved"
                        ? "bg-green-500/10 text-green-400 border-green-500/20 group-hover/row:shadow-lg group-hover/row:shadow-green-500/20"
                        : i.status === "Rejected"
                        ? "bg-red-500/10 text-red-400 border-red-500/20 group-hover/row:shadow-lg group-hover/row:shadow-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 group-hover/row:shadow-lg group-hover/row:shadow-yellow-500/20"
                    }`}>
                      {i.status.toLowerCase()}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-3">
                      <Eye
                        size={18}
                        className="cursor-pointer text-[#8b7cf6] hover:scale-110 hover:text-white transition-all duration-300"
                        onClick={() => preview(i.pdf_url)}
                      />

                      <Download
                        size={18}
                        className="cursor-pointer text-[#8b7cf6] hover:scale-110 hover:text-white transition-all duration-300"
                        onClick={() => download(i.pdf_url)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Summary footer */}
        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-400 relative z-10">
            <span>Showing {filtered.length} of {data.length} submissions</span>
            <span className="flex gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Approved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400"></span> Rejected
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ⭐ ENHANCED Btn component with professional animations */
function Btn({ t, a, f, count }) {
  return (
    <button
      onClick={f}
      className={`relative px-4 py-2 rounded-xl text-sm transition-all duration-300 overflow-hidden group/btn ${
        a 
          ? "bg-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/30 scale-105" 
          : "bg-[#1f1b36] hover:bg-[#2c274b] hover:scale-105 hover:shadow-lg hover:shadow-[#6c5ce7]/10"
      }`}
    >

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

      {/* Button content with count */}
      <span className="relative z-10 flex items-center gap-2">
        {t}
        {count !== undefined && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            a 
              ? "bg-white/20" 
              : "bg-[#2c274b] group-hover/btn:bg-[#1f1b36]"
          } transition-colors duration-300`}>
            {count}
          </span>
        )}
      </span>

      {/* Active indicator */}
      {a && (
        <span className="absolute -top-1 -right-1 w-2 h-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
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