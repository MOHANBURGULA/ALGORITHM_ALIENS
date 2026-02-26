import { X, Mail, User, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function InternDetailsModal({ intern, onClose }) {
  const [details,setDetails]=useState(null);
  const [teamLeads,setTeamLeads]=useState([]);
  const [selected,setSelected]=useState("");

  useEffect(()=>{
    if(!intern) return;

    const fetch=async()=>{
      const res=await api.get(`/hr/intern-details/${intern.id}`);
      setDetails(res.data);

      const tl=await api.get("/hr/teamleads");
      setTeamLeads(tl.data);
    };

    fetch();
  },[intern]);

  /* ⭐ FIXED ASSIGN */
  const assign=async()=>{
    if(!details || !selected) return;

    await api.put("/hr/assign-intern",{
      internId:details.id,
      teamLeadId:selected
    });

    onClose();
    window.location.reload();
  };

  /* ⭐ FIXED REMOVE */
  const remove=async()=>{
    if(!details) return;

    await api.delete(`/hr/remove-intern/${details.id}`);
    onClose();
    window.location.reload();
  };
  const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB");
  };

  if(!intern || !details) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-[#1f1b36] w-[520px] rounded-2xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Intern Details</h2>

        <div className="space-y-3 text-sm">
          <p className="flex gap-2 items-center"><User size={14}/> {details.name}</p>
          <p className="flex gap-2 items-center"><Mail size={14}/> {details.email}</p>
          <p className="flex gap-2 items-center">
            Joined: {formatDate(details.created_at)}
          </p>

          <p>Team Lead: {details.team_lead_name || "Not Assigned"}</p>
        </div>

        {/* dropdown */}
        <select
          value={selected}
          onChange={(e)=>setSelected(e.target.value)}
          className="w-full mt-5 bg-[#2c274b] p-2 rounded-lg"
        >
          <option value="">Select Team Lead</option>
          {teamLeads.map(t=>(
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <div className="mt-6 flex gap-3">
          <button
            disabled={!selected}
            onClick={assign}
            className="flex-1 bg-[#6c5ce7] py-2 rounded-xl disabled:opacity-40"
          >
            Assign / Reassign
          </button>

          <button
            onClick={remove}
            className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}