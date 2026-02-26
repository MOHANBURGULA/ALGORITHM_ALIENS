import { Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import TeamLeadSidebar from "../components/layouts/TeamLeadSidebar";

export default function TeamLeadLayout(){
  return(
    <div className="flex">
      <TeamLeadSidebar/>

      <div className="flex-1 bg-[#0f0c24] min-h-screen">
        <Navbar/>
        <div className="p-6">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}