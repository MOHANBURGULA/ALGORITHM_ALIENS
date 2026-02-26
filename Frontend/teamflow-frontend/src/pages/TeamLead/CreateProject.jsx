import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  AlignLeft, 
  CheckCircle,
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function CreateProject() {
  const [interns, setInterns] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await api.get("/teamlead/my-interns");
        setInterns(res.data);
      } catch (err) {
        toast.error("Intern fetch failed");
      }
    };
    fetchInterns();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description || !form.deadline)
        return toast.error("Fill all fields");

      if (!selected) return toast.error("Select intern");

      await api.post("/teamlead/create-project", {
        ...form,
        internId: selected
      });

      toast.success("Project created successfully 🚀");

      setForm({ title: "", description: "", deadline: "" });
      setSelected(null);

    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div className="p-2">
      {/* Header with decorative element */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Create New Project
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Assign and manage intern projects
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
            
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#8b7cf6] rounded-full"></div>
              <h2 className="text-lg font-semibold">Project Details</h2>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              {/* Project Name Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Project Name
                </label>
                <div className="relative group">
                  <input
                    placeholder="E.g., E-commerce Dashboard"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#14112a] p-4 rounded-xl outline-none 
                             hover:bg-[#1a1535] transition-all duration-300 
                             border border-white/5 hover:border-white/10 
                             focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50
                             placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  placeholder="Describe the project scope, goals, and deliverables..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#14112a] p-4 rounded-xl outline-none h-32
                           hover:bg-[#1a1535] transition-all duration-300 
                           border border-white/5 hover:border-white/10 
                           focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50
                           placeholder:text-gray-600 resize-none"
                />
              </div>

              {/* Deadline Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full bg-[#14112a] p-4 rounded-xl outline-none 
                             hover:bg-[#1a1535] transition-all duration-300 
                             border border-white/5 hover:border-white/10 
                             focus:border-[#8b7cf6]/50 focus:ring-1 focus:ring-[#8b7cf6]/50
                             text-gray-300 [color-scheme:dark]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] 
                         rounded-xl font-semibold text-lg relative overflow-hidden group
                         hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] 
                         transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Create Project
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Intern Selection */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden sticky top-4">
            
            {/* Intern Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8b7cf6]" />
                  <h3 className="font-semibold">Assign Intern</h3>
                </div>
                <span className="text-xs bg-[#8b7cf6]/20 text-[#8b7cf6] px-2 py-1 rounded-full">
                  {interns.length} available
                </span>
              </div>
            </div>

            {/* Intern List */}
            <div className="p-4">
              {interns.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No interns available</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {interns.map((i, index) => (
                    <div
                      key={i.id}
                      onClick={() => setSelected(i.id)}
                      className={`
                        group relative p-4 rounded-xl cursor-pointer
                        transition-all duration-300 hover:shadow-lg
                        border-2 overflow-hidden
                        ${selected === i.id 
                          ? "border-[#6c5ce7] bg-[#6c5ce7]/10" 
                          : "border-white/5 hover:border-[#6c5ce7]/30 bg-[#14112a] hover:bg-[#1a1535]"
                        }
                      `}
                    >
                      {/* Selection Indicator */}
                      {selected === i.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-4 h-4 text-[#6c5ce7]" />
                        </div>
                      )}

                      {/* Intern Info */}
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          transition-all duration-300 group-hover:scale-110
                          ${selected === i.id 
                            ? "bg-[#6c5ce7] text-white" 
                            : "bg-[#1f1b36] text-[#8b7cf6]"
                          }
                        `}>
                          <span className="font-semibold">
                            {i.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium group-hover:text-white transition-colors">
                            {i.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {i.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6c5ce7]/0 to-[#6c5ce7]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Intern Badge */}
              {selected && (
                <div className="mt-4 p-3 bg-[#6c5ce7]/20 rounded-xl border border-[#6c5ce7]/30">
                  <p className="text-xs text-gray-400 mb-1">Selected Intern</p>
                  <p className="text-sm font-medium text-[#6c5ce7]">
                    {interns.find(i => i.id === selected)?.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-[#1f1b36] rounded-xl border border-white/5 p-4">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#8b7cf6]" />
          <span>Fill all fields and select an intern to create a new project</span>
        </div>
      </div>
    </div>
  );
}