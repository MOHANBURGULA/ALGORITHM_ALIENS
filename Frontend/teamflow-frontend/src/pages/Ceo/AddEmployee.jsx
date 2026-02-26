import { useState, useEffect } from "react";
import api from "../../api/axios";
import { UserPlus, Users, Briefcase } from "lucide-react";

export default function AddEmployee() {
  const [role, setRole] = useState("INTERN");
  const [teamLeads, setTeamLeads] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    team_lead_id: ""
  });

  useEffect(() => {
    fetchTeamLeads();
  }, []);

  const fetchTeamLeads = async () => {
    const res = await api.get("/ceo/team-leads");
    setTeamLeads(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await api.post("/ceo/create-employee", { ...form, role });
    alert("Employee created");
    setForm({ name: "", email: "", password: "", team_lead_id: "" });
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header with animated accent */}
      <div className="group/header">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
          Add Employee
        </h2>
        <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">Create interns, HR or team leads</p>
      </div>

      {/* Role Cards with Enhanced Hover Effects */}
      <div className="grid grid-cols-3 gap-4">
        <RoleCard 
          icon={<UserPlus className="transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3" />} 
          label="Intern" 
          active={role === "INTERN"} 
          onClick={() => setRole("INTERN")}
        />
        <RoleCard 
          icon={<Users className="transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3" />} 
          label="Team Lead" 
          active={role === "TEAM_LEAD"} 
          onClick={() => setRole("TEAM_LEAD")}
        />
        <RoleCard 
          icon={<Briefcase className="transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3" />} 
          label="HR" 
          active={role === "HR"} 
          onClick={() => setRole("HR")}
        />
      </div>

      {/* Form Container with Enhanced Effects */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-4 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 group/form">
        
        {/* Decorative gradient line */}
        <div className="col-span-2 h-1 bg-gradient-to-r from-[#6c5ce7] via-[#8b7cf6] to-transparent rounded-full mb-2 opacity-0 group-hover/form:opacity-100 transition-opacity duration-500"></div>

        <Input 
          label="Name" 
          name="name" 
          value={form.name} 
          onChange={handleChange}
          icon="👤"
        />
        <Input 
          label="Email" 
          name="email" 
          value={form.email} 
          onChange={handleChange}
          icon="📧"
        />
        <Input 
          label="Password" 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={handleChange}
          icon="🔒"
        />

        {role === "INTERN" && (
          <div className="flex flex-col gap-1 group/select">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-[#6c5ce7] rounded-full group-hover/select:h-5 transition-all duration-300"></span>
              Team Lead
            </p>
            <select
              name="team_lead_id"
              value={form.team_lead_id}
              onChange={handleChange}
              className="bg-[#2c274b] p-2 rounded-lg outline-none focus:ring-2 focus:ring-[#6c5ce7] transition-all duration-300 hover:bg-[#332d52] cursor-pointer"
            >
              <option value="">Select team lead</option>
              {teamLeads.map(t => (
                <option key={t.id} value={t.id} className="bg-[#2c274b]">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={submit}
          className="col-span-2 mt-4 py-3 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] relative overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-[#6c5ce7]/30 hover:scale-[1.02]"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
          
          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2">
            Create {role}
            <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </button>

      </div>
    </div>
  );
}

/* ⭐ ENHANCED RoleCard with Professional Animations */
function RoleCard({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group/card p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all duration-300 ${
        active
          ? "border-[#8b7cf6] bg-[#2c274b] shadow-lg shadow-[#6c5ce7]/20 scale-105"
          : "border-white/5 hover:bg-white/5 hover:scale-105 hover:shadow-lg hover:shadow-[#6c5ce7]/10"
      }`}
    >
      <div className={`transition-all duration-300 ${active ? 'text-[#8b7cf6]' : 'group-hover/card:text-[#8b7cf6]'}`}>
        {icon}
      </div>
      <p className="font-semibold relative">
        {label}
        {active && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full animate-pulse"></span>
        )}
      </p>
    </div>
  );
}

/* ⭐ ENHANCED Input with Professional Focus Effects */
function Input({ label, icon, ...props }) {
  return (
    <div className="flex flex-col gap-1 group/input">
      <p className="text-gray-400 text-sm flex items-center gap-2">
        <span className="w-1 h-4 bg-[#6c5ce7] rounded-full group-hover/input:h-5 transition-all duration-300"></span>
        {label}
        {icon && <span className="text-sm opacity-0 group-hover/input:opacity-100 transition-opacity duration-300">{icon}</span>}
      </p>
      <input 
        {...props} 
        className="bg-[#2c274b] p-2 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] focus:scale-[1.02]" 
      />
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

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
*/