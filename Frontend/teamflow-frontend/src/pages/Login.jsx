import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, KeyRound, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ⭐ LOGIN */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);

      const token = res.data.token || res.data.accessToken;
      if (!token) {
        setError("Token not received");
        return;
      }

      localStorage.setItem("token", token);

      const role = res.data.role || res.data.user?.role;
      localStorage.setItem("role", role);

      if (role === "CEO") navigate("/ceo");
      else if (role === "HR") navigate("/hr");
      else if (role === "TEAM_LEAD") navigate("/teamlead");
      else navigate("/intern");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0b1f] relative overflow-hidden animate-fadeIn">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Floating gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6c5ce7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8b7cf6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#6c5ce7] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* ✅ FIXED GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0 L0 0 0 60' fill='none' stroke='rgba(108,92,231,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E\")"
          }}
        />
      </div>

      {/* Main login card */}
      <div className="w-[420px] bg-[#1f1b36] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group/card animate-slideUp">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c5ce7] via-[#8b7cf6] to-transparent"></div>

        {/* TITLE */}
        <div className="relative z-10 text-center group/title">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] bg-clip-text text-transparent mb-2 animate-gradient">
            TeamFlow
          </h1>

          <div className="flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-[#8b7cf6] animate-pulse" />
            <p className="text-gray-400 group-hover/title:text-gray-300 transition-colors duration-300">
              Sign in to your account
            </p>
            <Sparkles size={16} className="text-[#8b7cf6] animate-pulse animation-delay-1000" />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="relative z-10 bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm animate-shake border border-red-500/20">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10 mt-8">

          {/* EMAIL */}
          <div className="group/field">
            <label className="text-sm text-gray-400 flex items-center gap-1">
              <Mail size={14} /> Email
            </label>
            <div className="relative mt-1">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="your.email@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#6c5ce7] outline-none"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="group/field">
            <label className="text-sm text-gray-400 flex items-center gap-1">
              <Lock size={14} /> Password
            </label>
            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#6c5ce7] outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] font-semibold"
          >
            Sign In →
          </button>
        </form>

        <Link to="/forgot-password" className="block mt-6 text-center text-sm text-gray-400">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}