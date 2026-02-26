import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

export default function SubmitWork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  /* ⭐ CHANGE → projects array instead of single project */
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* ⭐ FETCH PROJECTS (minimal change) */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get("/intern/my-project");

        if (!res.data || res.data.length === 0) {
          setProjects([]);
        } else {
          setProjects(res.data);
          setSelectedProject(res.data[0].id); // default first project
        }
      } catch (err) {
        console.log("Project fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /* ⭐ SAFE SUBMIT */
  const submit = async () => {
    try {
      if (!selectedProject) return alert("No project selected");
      if (!file || !title) return alert("File & title required");

      const form = new FormData();
      form.append("projectId", selectedProject);
      form.append("title", title);
      form.append("description", description);
      form.append("pdf", file);

      await api.post("/intern/submit", form);

      setSubmitSuccess(true);
      alert("Submitted successfully");

      setTitle("");
      setDescription("");
      setFile(null);
      
      setTimeout(() => setSubmitSuccess(false), 3000);

    } catch (err) {
      console.log("Submit error:", err.response?.data || err);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return (
    <div className="max-w-[900px] mx-auto space-y-6 p-2">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-[#2c274b] rounded mb-2"></div>
        <div className="h-4 w-64 bg-[#2c274b] rounded"></div>
      </div>
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 space-y-5">
        <div className="h-6 w-40 bg-[#2c274b] rounded animate-pulse"></div>
        <div className="h-12 bg-[#2c274b] rounded-xl animate-pulse"></div>
        <div className="h-12 bg-[#2c274b] rounded-xl animate-pulse"></div>
        <div className="h-[120px] bg-[#2c274b] rounded-xl animate-pulse"></div>
        <div className="h-[200px] bg-[#2c274b] rounded-xl animate-pulse"></div>
      </div>
    </div>
  );

  if (!projects.length) return (
    <div className="max-w-[900px] mx-auto p-2">
      <div className="bg-[#1f1b36] p-8 rounded-2xl border border-white/5 text-center">
        <AlertCircle className="w-16 h-16 text-[#8b7cf6] mx-auto mb-4 opacity-50" />
        <p className="text-gray-400 text-lg">No project assigned</p>
        <p className="text-gray-500 text-sm mt-2">Please contact your team lead</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto space-y-8 p-2">
      {/* HEADER - Enhanced */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Submit Work
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload your completed tasks and deliverables
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {submitSuccess && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400">Submission completed successfully!</p>
        </div>
      )}

      {/* MAIN CARD - Enhanced */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center gap-3">
          <div className="w-1 h-6 bg-[#8b7cf6] rounded-full"></div>
          <h2 className="text-lg font-semibold">New Submission</h2>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">

          {/* ⭐ PROJECT SELECT - Enhanced */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Select Project
            </label>
            <div className="relative group">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-[#2c274b] p-3.5 rounded-xl outline-none appearance-none cursor-pointer hover:bg-[#322d52] transition-all duration-300 border border-white/5 hover:border-white/10 text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#2c274b]">
                    {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[#8b7cf6] transition-colors" />
            </div>
          </div>

          {/* TITLE - Enhanced */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Task Title
            </label>
            <input
              className="w-full bg-[#2c274b] p-3.5 rounded-xl outline-none hover:bg-[#322d52] transition-all duration-300 border border-white/5 hover:border-white/10 focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50"
              placeholder="E.g., Checkout Flow Implementation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION - Enhanced */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              className="w-full bg-[#2c274b] p-3.5 rounded-xl outline-none h-[120px] hover:bg-[#322d52] transition-all duration-300 border border-white/5 hover:border-white/10 focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50 resize-none"
              placeholder="Describe what you've accomplished..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* UPLOAD - Enhanced with drag effects */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center 
                transition-all duration-300 overflow-hidden group
                ${isDragging 
                  ? 'border-[#8b7cf6] bg-[#8b7cf6]/10' 
                  : 'border-white/10 hover:border-[#8b7cf6]/30 hover:bg-[#8b7cf6]/5'
                }
                ${file ? 'bg-[#8b7cf6]/5' : 'bg-[#18142c]'}
              `}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b7cf6]/0 to-[#8b7cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-[#8b7cf6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-[#8b7cf6]" />
                    </div>
                    <p className="text-white font-medium mb-1">File selected</p>
                    <p className="text-sm text-[#8b7cf6] mb-3">{file.name}</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={48} className="mx-auto mb-4 text-gray-400 group-hover:text-[#8b7cf6] transition-colors group-hover:scale-110 transform duration-300" />
                    <p className="text-gray-300 mb-1">Drag & drop files here</p>
                    <p className="text-gray-500 text-sm mb-4">or</p>
                    <label className="inline-block bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] px-6 py-3 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium">
                      Browse Files
                      <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                    </label>
                  </>
                )}
              </div>

              {/* Supported formats */}
              {!file && (
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              )}
            </div>
          </div>

          {/* BUTTON - Enhanced */}
          <button
            onClick={submit}
            disabled={!title || !file || !selectedProject}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg
              transition-all duration-300 relative overflow-hidden group
              ${!title || !file || !selectedProject
                ? 'opacity-50 cursor-not-allowed bg-gray-600'
                : 'bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Upload className="w-5 h-5 group-hover:animate-bounce" />
              Submit Work
            </span>
            {title && file && selectedProject && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-[#1f1b36] p-5 rounded-xl border border-white/5">
        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#8b7cf6]" />
          Submission Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#8b7cf6]"></div>
            Make sure your file is properly named
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#8b7cf6]"></div>
            Include a clear description of your work
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#8b7cf6]"></div>
            Double-check before submitting
          </li>
        </ul>
      </div>
    </div>
  );
}