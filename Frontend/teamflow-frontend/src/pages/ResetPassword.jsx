import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.post("/auth/reset-password", { token, password });

    alert("Password reset successful");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-[#1f1b36] p-8 rounded-xl w-[420px]">
        <h2 className="mb-4 text-xl font-semibold">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 bg-[#2c274b] rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full mt-4 py-2 bg-[#6c5ce7] rounded-lg"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}