import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Download, Eye, FileText, Filter, X, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function MySubmissions() {
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ⭐ NEW FEEDBACK STATES */
  const [viewFeedback, setViewFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/intern/my-submissions");
        setSubs(res.data || []);
      } catch (err) {
        console.error("Fetch submissions error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  /* ⭐ FILTER */
  const filtered =
    filter === "ALL"
      ? subs
      : subs.filter((s) => s.status === filter);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Rejected':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getCountByStatus = (status) => {
    if (status === "ALL") return subs.length;
    return subs.filter(s => s.status === status).length;
  };

  if (loading) return (
    <div className="space-y-6 p-2">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-[#2c274b] rounded mb-2"></div>
        <div className="h-4 w-64 bg-[#2c274b] rounded"></div>
      </div>
      <div className="flex gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-10 w-20 bg-[#2c274b] rounded-xl animate-pulse"></div>
        ))}
      </div>
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5">
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 bg-[#2c274b] rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-2">
      {/* HEADER - Enhanced */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            My Submissions
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Track and manage your submitted work
          </p>
        </div>
      </div>

      {/* FILTERS - Enhanced with counts */}
      <div className="flex flex-wrap gap-3">
        <FilterBtn 
          text="All" 
          count={getCountByStatus("ALL")}
          active={filter==="ALL"} 
          onClick={()=>setFilter("ALL")} 
        />
        <FilterBtn 
          text="Pending" 
          count={getCountByStatus("Pending")}
          active={filter==="Pending"} 
          onClick={()=>setFilter("Pending")} 
        />
        <FilterBtn 
          text="Approved" 
          count={getCountByStatus("Approved")}
          active={filter==="Approved"} 
          onClick={()=>setFilter("Approved")} 
        />
        <FilterBtn 
          text="Rejected" 
          count={getCountByStatus("Rejected")}
          active={filter==="Rejected"} 
          onClick={()=>setFilter("Rejected")} 
        />
      </div>

      {/* TABLE - Enhanced */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8b7cf6]" />
            <span className="text-sm font-medium">Submissions Overview</span>
          </div>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-[#2c274b] rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-lg font-medium">No submissions found</p>
            <p className="text-sm text-gray-500 mt-1">Try changing your filter</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((s, index) => (
              <div
                key={s.id}
                className="group bg-[#2c274b] hover:bg-[#322d52] transition-all duration-300 p-5 hover:pl-6 border-l-2 border-l-transparent hover:border-l-[#8b7cf6]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* LEFT - Title and Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-[#1f1b36] rounded-lg group-hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4 text-[#8b7cf6]" />
                      </div>
                      <p className="font-semibold truncate group-hover:text-white transition-colors">
                        {s.title || "Untitled Submission"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 ml-9">
                      {s.submitted_at
                        ? new Date(s.submitted_at).toLocaleDateString("en-GB", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : "-"}
                    </p>
                  </div>

                  {/* FILE - Enhanced */}
                  <div className="flex items-center gap-2 text-sm min-w-[200px]">
                    <div className="flex items-center gap-2 bg-[#1f1b36] px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-all">
                      <FileText size={14} className="text-[#8b7cf6]" />
                      <span className="text-gray-300 truncate max-w-[150px]">
                        {s.pdf_url || "No file attached"}
                      </span>
                    </div>
                  </div>

                  {/* STATUS - Enhanced */}
                  <div className="flex items-center gap-2">
                    <StatusTag status={s.status} icon={getStatusIcon(s.status)} />
                  </div>

                  {/* ACTIONS - Enhanced with prominently featured feedback button */}
                  <div className="flex items-center gap-2">
                    {s.pdf_url && (
                      <>
                        <a
                          href={`http://localhost:5000/uploads/${s.pdf_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-[#1f1b36] rounded-lg hover:bg-[#8b7cf6]/10 transition-all duration-300 group/btn"
                          title="Preview"
                        >
                          <Eye size={18} className="text-[#8b7cf6] group-hover/btn:scale-110 transition-transform" />
                        </a>

                        <a
                          href={`http://localhost:5000/uploads/${s.pdf_url}`}
                          download
                          className="p-2 bg-[#1f1b36] rounded-lg hover:bg-[#8b7cf6]/10 transition-all duration-300 group/btn"
                          title="Download"
                        >
                          <Download size={18} className="text-[#8b7cf6] group-hover/btn:scale-110 transition-transform" />
                        </a>
                      </>
                    )}

                    {/* ⭐ FEEDBACK BUTTON - Prominently featured with purple color */}
                    {s.feedback && (
                      <button
                        onClick={() => {
                          setFeedbackMsg(s.feedback);
                          setSelectedSubmission(s);
                          setViewFeedback(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#8b7cf6]/20 hover:bg-[#8b7cf6]/30 rounded-lg transition-all duration-300 group/feedback border border-[#8b7cf6]/30 hover:border-[#8b7cf6]/50"
                        title="View feedback"
                      >
                        <MessageCircle size={16} className="text-[#8b7cf6] group-hover/feedback:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-[#8b7cf6]">Feedback</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⭐ FEEDBACK MODAL - Enhanced */}
      {viewFeedback && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#8b7cf6]/20 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-[#8b7cf6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">TeamLead Feedback</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedSubmission.title || "Submission"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewFeedback(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="bg-[#2c274b] p-5 rounded-xl border border-white/5">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {feedbackMsg}
                </p>
              </div>

              {/* Status Badge in Modal */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">Submission Status</span>
                <StatusTag status={selectedSubmission.status} icon={getStatusIcon(selectedSubmission.status)} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={() => setViewFeedback(false)}
                className="w-full px-4 py-3 bg-[#2c274b] hover:bg-[#322d52] text-[#8b7cf6] rounded-xl transition-all duration-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ⭐ FILTER BUTTON - Enhanced with counts */
function FilterBtn({ text, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative px-5 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-300 hover:shadow-lg
        ${active 
          ? "bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] text-white shadow-lg" 
          : "bg-[#1f1b36] border border-white/5 text-gray-400 hover:text-white hover:border-white/10 hover:bg-[#2c274b]"
        }
      `}
    >
      <span className="flex items-center gap-2">
        {text}
        {count > 0 && (
          <span className={`
            px-1.5 py-0.5 rounded-full text-xs
            ${active 
              ? "bg-white/20 text-white" 
              : "bg-[#8b7cf6]/20 text-[#8b7cf6] group-hover:bg-[#8b7cf6]/30"
            }
          `}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

/* ⭐ STATUS TAG - Enhanced with icons */
function StatusTag({ status, icon }) {
  const map = {
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Approved: "bg-green-500/20 text-green-400 border border-green-500/30",
    Rejected: "bg-red-500/20 text-red-400 border border-red-500/30"
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${map[status] || ""}`}>
      {icon}
      {status || "-"}
    </span>
  );
}