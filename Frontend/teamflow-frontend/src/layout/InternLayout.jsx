import InternSidebar from "../components/layouts/InternSidebar";
import Navbar from "../components/layouts/Navbar";
import { Outlet } from "react-router-dom";

export default function InternLayout(){
  return(
    <div className="flex min-h-screen bg-[#0f0c29] text-white">
      <InternSidebar/>

      <div className="flex-1 flex flex-col">
        <Navbar/>
        <div className="p-6">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}