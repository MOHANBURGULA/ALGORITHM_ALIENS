import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import { Outlet } from "react-router-dom";

export default function CeoLayout(){
  return(
    <div className="flex bg-[#0f0c24] text-white min-h-screen">

      {/* ⭐ sidebar fixed full height */}
      <Sidebar/>

      {/* ⭐ main content */}
      <div className="flex-1 flex flex-col">

        {/* navbar */}
        <Navbar/>

        {/* ⭐ page content changes here */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet/>
        </div>

      </div>
    </div>
  );
}