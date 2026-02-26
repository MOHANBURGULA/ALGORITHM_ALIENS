import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Download, 
  Eye, 
  FileText, 
  X, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  ChevronRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from "lucide-react";

export default function ReviewSubmission() {
  const [subs, setSubs] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  const fetchSubs = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/teamlead/review-submissions",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    setSubs(res.data);
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const review = async (id, status) => {
    await axios.post(
      "http://localhost:5000/api/teamlead/review",
      { submissionId: id, status, feedback: "" },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    fetchSubs();
  };

  /* ⭐ OPEN FEEDBACK */
  const openFeedback = (sub) => {
    setSelectedSub(sub);
    setFeedbackText(sub.feedback || "");
    setFeedbackModal(true);
  };

  /* ⭐ SEND FEEDBACK */
  const sendFeedback = async () => {
    await axios.post(
      "http://localhost:5000/api/teamlead/review",
      {
        submissionId: selectedSub.id,
        status: selectedSub.status,
        feedback: feedbackText
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setFeedbackModal(false);
    fetchSubs();
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  if (!subs.length)
    return (
      <div className="p-8 min-h-screen">
        <div className="bg-[#1f1b36] rounded-2xl border border-white/5 p-12 text-center">
          <div className="w-20 h-20 bg-[#2c274b] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No submissions available</h2>
          <p className="text-gray-400">Submissions from interns will appear here</p>
        </div>
      </div>
    );

  return (
    <div className="p-8 min-h-screen">
      {/* Header with decorative element */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Review Submissions
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Evaluate and provide feedback on intern submissions
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1f1b36] p-4 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Total Submissions</p>
          <p className="text-2xl font-bold text-white">{subs.length}</p>
        </div>
        <div className="bg-[#1f1b36] p-4 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{subs.filter(s => s.status === "Pending").length}</p>
        </div>
        <div className="bg-[#1f1b36] p-4 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-400">{subs.filter(s => s.status === "Approved").length}</p>
        </div>
        <div className="bg-[#1f1b36] p-4 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-400">{subs.filter(s => s.status === "Rejected").length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {subs.map((s, index) => {
          const fileName = s.pdf_url.split("/").pop();

          return (
            <div 
              key={s.id} 
              className="group bg-gradient-to-r from-[#0f172a]/80 to-[#1e293b]/70 border border-[#334155] rounded-2xl p-6 shadow-lg backdrop-blur-xl hover:border-[#8b7cf6]/30 transition-all duration-300 hover:shadow-xl"
            >
              {/* Top Section */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Intern Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#8b7cf6]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-[#8b7cf6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white group-hover:text-[#8b7cf6] transition-colors">
                      {s.intern_name}
                    </h2>
                    <p className="text-gray-400 flex items-center gap-2 mt-1">
                      <FileText className="w-3.5 h-3.5" />
                      {s.project_title}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(s.status)}`}>
                    {getStatusIcon(s.status)}
                    {s.status}
                  </span>
                </div>
              </div>

              {/* File Info */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="bg-[#1e293b] px-4 py-2 rounded-xl flex items-center gap-2 group/file hover:bg-[#2d3748] transition-all">
                  <FileText className="w-4 h-4 text-[#8b7cf6]" />
                  <span className="text-sm text-white">{fileName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Submitted: {new Date(s.submitted_at).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                {/* Preview Button */}
                <a 
                  href={`http://localhost:5000/uploads/${s.pdf_url}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group/btn px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#2d3748] text-white transition-all duration-300 flex items-center gap-2 border border-white/5 hover:border-white/10"
                >
                  <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Preview
                </a>

                {/* Download Button */}
                <a 
                  href={`http://localhost:5000/uploads/${s.pdf_url}`} 
                  download 
                  className="group/btn px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#2d3748] text-white transition-all duration-300 flex items-center gap-2 border border-white/5 hover:border-white/10"
                >
                  <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Download
                </a>

                {/* Reject Button */}
                <button 
                  onClick={() => review(s.id, "Rejected")} 
                  className="group/btn px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-300 flex items-center gap-2 border border-red-500/30 hover:border-red-500/50"
                >
                  <ThumbsDown className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Reject
                </button>

                {/* Approve Button */}
                <button 
                  onClick={() => review(s.id, "Approved")} 
                  className="group/btn px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white transition-all duration-300 flex items-center gap-2 border border-green-500/30 hover:border-green-500/50"
                >
                  <ThumbsUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Approve
                </button>

                {/* Feedback Button - Prominently featured */}
                <button 
                  onClick={() => openFeedback(s)} 
                  className="group/btn px-4 py-2.5 rounded-xl bg-[#8b7cf6]/20 hover:bg-[#8b7cf6] text-[#8b7cf6] hover:text-white transition-all duration-300 flex items-center gap-2 border border-[#8b7cf6]/30 hover:border-[#8b7cf6]/50"
                >
                  <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Feedback
                  <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Existing Feedback Display */}
              {s.feedback && (
                <div className="mt-4 p-3 bg-[#8b7cf6]/10 rounded-xl border border-[#8b7cf6]/20">
                  <p className="text-xs text-[#8b7cf6] mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Previous Feedback:
                  </p>
                  <p className="text-sm text-gray-300">{s.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ⭐ FEEDBACK MODAL - Enhanced */}
      {feedbackModal && selectedSub && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#8b7cf6]/20 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-[#8b7cf6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Provide Feedback</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    for {selectedSub.intern_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Project: {selectedSub.project_title}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(selectedSub.status)}`}>
                    {getStatusIcon(selectedSub.status)}
                    Current: {selectedSub.status}
                  </span>
                </div>
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#2c274b] text-white border border-white/5 focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50 outline-none transition-all resize-none"
                rows={5}
                placeholder="Write your feedback here..."
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 pt-0">
              <button 
                onClick={() => setFeedbackModal(false)} 
                className="px-4 py-2 bg-[#2c274b] hover:bg-[#322d52] text-gray-400 hover:text-white rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                onClick={sendFeedback} 
                className="px-4 py-2 bg-[#8b7cf6] hover:bg-[#7b6de6] text-white rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}