import { useState } from "react";
import api from "../../api/axios";

export default function AddEmployeeHr() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_LEAD"
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");

      /* ⭐ FIXED ROUTE */
      await api.post("/hr/create-employee", form);

      setMsg("Employee created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "TEAM_LEAD"
      });

    } catch (err) {
      setMsg(err.response?.data?.message || "Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fadeIn">

      {/* Header with animated accent */}
      <div className="group/header mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
          Add Employee
        </h1>
        <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
          Create new team members (HR access)
        </p>
      </div>

      {/* Success/Error Message with animation */}
      {msg && (
        <div className={`mb-4 p-4 rounded-xl animate-slideIn ${
          msg.includes("success") 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {msg.includes("success") ? "✅" : "⚠️"}
            </span>
            <p>{msg}</p>
          </div>
        </div>
      )}

      {/* Form Container with enhanced animations */}
      <form
        onSubmit={submit}
        className="bg-[#1f1b36] p-6 rounded-2xl space-y-4 border border-white/5 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 group/form relative overflow-hidden"
      >

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/form:w-full transition-all duration-700"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/form:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#8b7cf6]/5 rounded-full blur-3xl group-hover/form:scale-150 transition-transform duration-700"></div>

        {/* Form fields with staggered entrance */}
        <div className="space-y-4 relative z-10">
          {/* NAME */}
          <div className="group/field">
            <label className="text-xs text-gray-400 mb-1 block group-hover/field:text-[#8b7cf6] transition-colors duration-300">
              👤 Full Name
            </label>
            <input
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-[#2c274b] p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] focus:scale-[1.02] placeholder:text-gray-500"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="group/field">
            <label className="text-xs text-gray-400 mb-1 block group-hover/field:text-[#8b7cf6] transition-colors duration-300">
              📧 Email Address
            </label>
            <input
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#2c274b] p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] focus:scale-[1.02] placeholder:text-gray-500"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="group/field">
            <label className="text-xs text-gray-400 mb-1 block group-hover/field:text-[#8b7cf6] transition-colors duration-300">
              🔒 Password
            </label>
            <input
              name="password"
              placeholder="Enter secure password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#2c274b] p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] focus:scale-[1.02] placeholder:text-gray-500"
              required
            />
          </div>

          {/* ROLE */}
          <div className="group/field">
            <label className="text-xs text-gray-400 mb-1 block group-hover/field:text-[#8b7cf6] transition-colors duration-300">
              💼 Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-[#2c274b] p-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-[#6c5ce7] hover:bg-[#332d52] cursor-pointer appearance-none"
              >
                <option value="TEAM_LEAD" className="bg-[#2c274b]">Team Lead</option>
                <option value="INTERN" className="bg-[#2c274b]">Intern</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7cf6] pointer-events-none">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON with enhanced animations */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] py-3 rounded-xl font-semibold overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-[#6c5ce7]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
        >

          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              <>
                Create Employee
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
              </>
            )}
          </span>

          {/* Loading progress bar (visual only) */}
          {loading && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-pulse w-full"></div>
          )}
        </button>

        {/* Form footer with hint */}
        <div className="text-center text-xs text-gray-500 pt-2">
          All fields are required
        </div>

      </form>

      {/* Quick info card */}
      <div className="mt-6 bg-[#1f1b36]/50 p-4 rounded-xl border border-white/5 text-sm text-gray-400 animate-slideIn animation-delay-200">
        <div className="flex items-start gap-3">
          <span className="text-[#8b7cf6] text-lg">ℹ️</span>
          <p>
            Creating a new employee will send an email with login instructions.
            Default password should be changed on first login.
          </p>
        </div>
      </div>

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

.animation-delay-200 {
  animation-delay: 0.2s;
}
*/