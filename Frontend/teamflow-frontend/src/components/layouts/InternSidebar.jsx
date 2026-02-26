import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Upload,
  FileText,
  Bell,
  LogOut
} from "lucide-react";

export default function InternSidebar(){
  return(
    <div className="w-[250px] bg-[#14112a] h-screen sticky top-0 text-white flex flex-col justify-between border-r border-white/5">

      <div>
        <h1 className="text-2xl font-bold p-6 text-[#8b7cf6]">TeamFlow</h1>
        <p className="px-6 text-gray-400 text-sm mb-4">Intern</p>

        <nav className="flex flex-col gap-2 px-4">
          <MenuItem icon={<LayoutDashboard/>} text="Dashboard" to="/intern"/>
          <MenuItem icon={<Folder/>} text="My Project" to="/intern/my-project"/>
          <MenuItem icon={<Upload/>} text="Submit Work" to="/intern/submit"/>
          <MenuItem icon={<FileText/>} text="My Submissions" to="/intern/my-submissions"/>
          <MenuItem icon={<Bell/>} text="Notifications" to="/intern/notifications"/>
        </nav>
      </div>

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