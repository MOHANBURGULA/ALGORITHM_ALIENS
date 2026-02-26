import HrSidebar from "../components/layouts/HrSidebar";
import Navbar from "../components/layouts/Navbar";
import { Outlet } from "react-router-dom";

export default function HrLayout(){
  return(
    <div className="flex bg-[#0f0c24] text-white min-h-screen">
      <HrSidebar/>

      <div className="flex-1 flex flex-col">
        <Navbar/>
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}