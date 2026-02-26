import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

/* ⭐ CEO */
import CeoLayout from "./layout/CeoLayout";
import CeoDashboard from "./pages/Ceo/CeoDashboard";
import TeamLeads from "./pages/Ceo/TeamLeads";
import Projects from "./pages/Ceo/Projects";
import Notifications from "./pages/Ceo/Notifications";
import AddEmployee from "./pages/Ceo/AddEmployee";
import Profile from "./pages/Ceo/Profile";

/* ⭐ HR */
import HrLayout from "./layout/HrLayout";
import HrDashboard from "./pages/Hr/HrDashboard";
import HrNotifications from "./pages/Hr/HrNotifications";
import HrInterns from "./pages/Hr/HrInterns";
import HrSubmissions from "./pages/Hr/HrSubmissions";
import HrProfile from "./pages/Hr/HrProfile";
import AddEmployeeHr from "./pages/Hr/AddEmployeeHr";

/* ⭐ TEAM LEAD */
import TeamLeadLayout from "./layout/TeamLeadLayout";
import TeamLeadDashboard from "./pages/TeamLead/TeamLeadDashboard";
import CreateProject from "./pages/TeamLead/CreateProject";
import ReviewSubmission from "./pages/TeamLead/ReviewSubmission";
import TeamLeadNotifications from "./pages/TeamLead/TeamLeadNotifications";
import TeamLeadProfile from "./pages/TeamLead/TeamLeadProfile";
import InternDashboard from "./pages/Intern/InternDashboard";
import InternLayout from "./layout/InternLayout";
import MyProject from "./pages/Intern/MyProject";
import SubmitWork from "./pages/Intern/SubmitWork";
import MySubmissions from "./pages/Intern/MySubmissions";
import InternNotifications from "./pages/Intern/InternNotifications";
import InternProfile from "./pages/Intern/InternProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>

        {/* ⭐ ROOT */}
        <Route path="/" element={<Navigate to="/login" replace/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ⭐ CEO ROUTES */}
        <Route
          path="/ceo"
          element={
            <ProtectedRoute>
              <CeoLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<CeoDashboard/>}/>
          <Route path="teamleads" element={<TeamLeads/>}/>
          <Route path="projects" element={<Projects/>}/>
          <Route path="notifications" element={<Notifications/>}/>
          <Route path="add-employee" element={<AddEmployee/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>

        {/* ⭐ HR ROUTES */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute>
              <HrLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<HrDashboard/>}/>
          <Route path="interns" element={<HrInterns/>}/>
          <Route path="add-employee" element={<AddEmployeeHr/>}/>
          <Route path="notifications" element={<HrNotifications/>}/> 
          <Route path="submissions" element={<HrSubmissions/>}/>
          <Route path="profile" element={<HrProfile/>}/>
        </Route>

        {/* ⭐ TEAM LEAD ROUTES */}
        <Route
          path="/teamlead"
          element={
            <ProtectedRoute>
              <TeamLeadLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<TeamLeadDashboard/>}/>
          <Route path="create-project" element={<CreateProject/>}/>
          <Route path="review" element={<ReviewSubmission />} />
          <Route path="notifications" element={<TeamLeadNotifications />} />
          <Route path="profile" element={<TeamLeadProfile />} />
        </Route>
        <Route path="/intern" element={<ProtectedRoute><InternLayout/></ProtectedRoute>}>
        <Route index element={<InternDashboard/>}/>
         <Route path="my-project" element={<MyProject />} />
          <Route path="submit" element={<SubmitWork />} />
          <Route path="my-submissions" element={<MySubmissions />} />
          <Route path="notifications" element={<InternNotifications />} />
           <Route path="profile" element={<InternProfile />} />
        </Route>

        {/* ⭐ FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}