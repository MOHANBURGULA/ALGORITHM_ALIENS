import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  FileText,
  Bell,
  LogOut
} from "lucide-react";

export default function TeamLeadSidebar(){
  return(
    <div className="w-[250px] bg-[#14112a] h-screen sticky top-0 text-white flex flex-col justify-between border-r border-white/5">

      {/* TOP */}
      <div>
        <h1 className="text-2xl font-bold p-6 text-[#8b7cf6]">TeamFlow</h1>
        <p className="px-6 text-gray-400 text-sm mb-4">Team Lead</p>

        <nav className="flex flex-col gap-2 px-4">
          <MenuItem icon={<LayoutDashboard/>} text="Dashboard" to="/teamlead"/>
          <MenuItem icon={<PlusSquare/>} text="Create Project" to="/teamlead/create-project"/>
          <MenuItem icon={<FileText/>} text="Review Submissions" to="/teamlead/review"/>
          <MenuItem icon={<Bell/>} text="Notifications" to="/teamlead/notifications"/>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-4">
        <button
          onClick={()=>{
            localStorage.clear();
            window.location.href="/login";
          }}
          className="flex items-center gap-3 p-3 text-red-400 hover:bg-white/5 rounded-lg w-full"
        >
          <LogOut size={18}/> Log Out
        </button>
      </div>
    </div>
  );
}

function MenuItem({icon,text,to}){
  return(
    <NavLink
      to={to}
      className={({isActive})=>
        `flex items-center gap-3 p-3 rounded-xl transition ${
          isActive
            ? "bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6]"
            : "hover:bg-white/5"
        }`
      }
    >
      {icon} {text}
    </NavLink>
  );
}