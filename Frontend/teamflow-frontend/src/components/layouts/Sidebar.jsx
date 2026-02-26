import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Bell,
  LogOut,
  UserPlus
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-[250px] bg-[#14112a] h-screen sticky top-0 text-white flex flex-col justify-between border-r border-white/5">

      <div>
        <h1 className="text-2xl font-bold p-6 text-[#8b7cf6]">TeamFlow</h1>

        <nav className="flex flex-col gap-2 px-4">
          <MenuItem icon={<LayoutDashboard />} text="Dashboard" to="/ceo" />
          <MenuItem icon={<Users />} text="Team Leads" to="/ceo/teamleads" />
          <MenuItem icon={<FolderKanban />} text="Projects" to="/ceo/projects" />
          <MenuItem icon={<Bell />} text="Notifications" to="/ceo/notifications" />
          <MenuItem icon={<UserPlus />} text="Add Employee" to="/ceo/add-employee" />
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