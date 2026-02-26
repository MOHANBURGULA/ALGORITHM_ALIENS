import { useState } from "react";
import api from "../api/axios";
import { Mail, KeyRound, ArrowLeft, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!email) {
        setMsg("Email required");
        return;
      }

      setLoading(true);
      setMsg("");

      const res = await api.post("/auth/forgot-password", { email });

      setLink(res.data.resetLink);
      setMsg("Reset link generated successfully");
      setCopied(false);

    } catch (err) {
      console.log(err);
      setMsg(err.response?.data?.message || "Error generating reset link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0f0b1f] relative overflow-hidden animate-fadeIn">

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6c5ce7] rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8b7cf6] rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* ✅ FIXED GRID */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0 L0 0 0 60' fill='none' stroke='rgba(108,92,231,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E\")"
          }}
        />
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-400 hover:text-[#8b7cf6] flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Login
      </Link>

      {/* Card */}
      <div className="bg-[#1f1b36] p-8 rounded-xl w-[420px] border border-white/5 shadow-2xl relative overflow-hidden animate-slideUp">

        <div className="relative z-10 text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] flex items-center justify-center">
            <KeyRound size={32} />
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] bg-clip-text text-transparent">
            Forgot Password?
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Message */}
        {msg && (
          <div className="p-3 rounded-lg mb-4 text-sm">
            {msg}
          </div>
        )}

        {/* Email */}
        <div className="relative z-10">
          <label className="text-sm text-gray-400 mb-1 block">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              placeholder="Enter your email"
              className="w-full p-3 pl-10 bg-[#2c274b] rounded-lg border border-white/5 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] font-semibold"
        >
          {loading ? "Generating..." : "Generate Reset Link →"}
        </button>

        {/* Link display */}
        {link && (
          <div className="mt-6 p-4 bg-[#2c274b] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400 mb-2">Your reset link:</p>

            <div className="flex items-center gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm text-[#8b7cf6] break-all"
              >
                {link}
              </a>

              <button onClick={copyToClipboard}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}