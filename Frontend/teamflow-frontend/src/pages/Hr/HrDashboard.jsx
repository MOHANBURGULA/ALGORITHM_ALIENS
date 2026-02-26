import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, FolderKanban, AlertTriangle, Clock } from "lucide-react";
import DonutChart from "../../components/Charts/DonutChart";
import HrBarChart from "../../components/Charts/HrBarChart";

export default function HrDashboard() {
  const [data, setData] = useState(null);
  const [recentInterns, setRecentInterns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        /* ⭐ DASHBOARD */
        const res = await api.get("/hr/analytics-dashboard");
        setData(res.data);

        /* ⭐ RECENT INTERNS — FIXED ROUTE */
        const interns = await api.get("/hr/interns");

        setRecentInterns(interns.data.slice(0, 5));
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6c5ce7] border-t-transparent"></div>
    </div>
  );

  /* ⭐ DONUT */
  const assigned = data.internsPerTeamLead.reduce(
    (sum, t) => sum + Number(t.interncount),
    0
  );

  const donutData = [
    { name: "Assigned", value: assigned },
    { name: "Unassigned", value: data.totals.interns - assigned },
  ];

  /* ⭐ WEEKLY BAR */
  const barData = data.weeklySubmissions.map((w) => ({
    name: w.week,
    submissions: Number(w.total),
  }));

  /* ⭐ DATE FORMAT FIX */
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ⭐ Header with animated accent */}
      <div className="group/header">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#6c5ce7] rounded-full group-hover/header:h-10 transition-all duration-300"></span>
          HR Dashboard
        </h2>
        <p className="text-gray-400 group-hover/header:translate-x-4 transition-transform duration-300">
          Monitor interns, projects and submissions
        </p>
      </div>

      {/* ⭐ CARDS with enhanced hover effects */}
      <div className="grid grid-cols-4 gap-6">
        <Card icon={<Users />} title="Total Interns" value={data.totals.interns} delay={0.1} />
        <Card icon={<FolderKanban />} title="Active Projects" value={data.totals.activeProjects} delay={0.2} />
        <Card icon={<AlertTriangle />} title="Delayed Projects" value={data.totals.delayedProjects} delay={0.3} />
        <Card icon={<Clock />} title="Late Submissions" value={data.totals.lateSubmissions} delay={0.4} />
      </div>

      {/* ⭐ GRAPHS with enhanced containers */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Intern Assignment Distribution" delay={0.1}>
          <DonutChart data={donutData} />
        </ChartCard>

        <ChartCard title="Weekly Submission Trend" delay={0.2}>
          <HrBarChart data={barData} dataKey="submissions" />
        </ChartCard>
      </div>

      {/* ⭐ RECENT INTERNS with enhanced table */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl hover:shadow-2xl hover:shadow-[#6c5ce7]/10 transition-all duration-500 hover:border-[#6c5ce7]/20 border border-transparent group/table relative overflow-hidden animate-slideUp">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/table:w-full transition-all duration-700"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/table:scale-150 transition-transform duration-700"></div>

        <h3 className="mb-6 font-semibold flex items-center gap-2 relative z-10">
          <span className="w-1 h-6 bg-[#6c5ce7] rounded-full animate-pulse"></span>
          Recent Interns
        </h3>

        {/* Table Header */}
        <div className="grid grid-cols-4 text-gray-400 text-sm mb-4 pb-2 border-b border-white/5 relative z-10">
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Name</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Assignment</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Status</p>
          <p className="group-hover/table:text-[#8b7cf6] transition-colors duration-300">Joined Date</p>
        </div>

        {/* Table Rows */}
        {recentInterns.length === 0 ? (
          <div className="text-center text-gray-400 py-8 group/empty relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c274b] flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-gray-500" />
            </div>
            <p className="group-hover/empty:text-gray-300 transition-colors duration-300">No interns</p>
          </div>
        ) : (
          <div className="space-y-1 relative z-10">
            {recentInterns.map((i, index) => (
              <div
                key={i.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="grid grid-cols-4 py-3 border-t border-white/5 group/row hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 hover:shadow-lg rounded-lg px-2 animate-slideIn"
              >
                <p className="group-hover/row:text-white transition-colors duration-300">{i.name}</p>

                <p className="group-hover/row:text-gray-300 transition-colors duration-300">
                  {i.team_lead_id ? "Assigned" : "Not Assigned"}
                </p>

                <p className={`group-hover/row:scale-105 transition-all duration-300 ${
                  i.team_lead_id ? "text-blue-400" : "text-gray-400"
                }`}>
                  {i.team_lead_id ? "assigned" : "unassigned"}
                </p>

                <p className="group-hover/row:text-gray-300 transition-colors duration-300">
                  {formatDate(i.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/* ⭐ ENHANCED CARD with professional animations */
function Card({ icon, title, value, delay = 0 }) {
  return (
    <div 
      style={{ animationDelay: `${delay}s` }}
      className="group/card bg-[#1f1b36] p-6 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 border border-transparent hover:border-[#6c5ce7]/20 animate-slideUp relative overflow-hidden"
    >

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>

      {/* Icon container */}
      <div className="bg-[#6c5ce7] p-3 rounded-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300 group-hover/card:shadow-lg group-hover/card:shadow-[#6c5ce7]/30 relative z-10">
        <div className="group-hover/card:animate-pulse">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <p className="text-gray-400 text-sm group-hover/card:text-gray-300 transition-colors duration-300">
          {title}
        </p>
        <h2 className="text-xl font-bold group-hover/card:scale-105 origin-left transition-transform duration-300">
          {value}
        </h2>
      </div>

      {/* Small decorative dot */}
      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#6c5ce7] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

/* ⭐ ENHANCED CHART CARD with professional animations */
function ChartCard({ title, children, delay = 0 }) {
  return (
    <div 
      style={{ animationDelay: `${delay}s` }}
      className="bg-[#1f1b36] p-6 rounded-2xl group/chart hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 border border-transparent hover:border-[#6c5ce7]/20 animate-slideUp relative overflow-hidden"
    >

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] group-hover/chart:w-full transition-all duration-700"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6c5ce7]/5 rounded-full blur-3xl group-hover/chart:scale-150 transition-transform duration-700"></div>

      <h3 className="mb-4 font-semibold flex items-center gap-2 relative z-10">
        <span className="w-1 h-5 bg-[#6c5ce7] rounded-full group-hover/chart:h-6 transition-all duration-300"></span>
        {title}
      </h3>

      {/* Chart container */}
      <div className="relative z-10 group-hover/chart:scale-[1.02] transition-transform duration-500">
        {children}
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#8b7cf6] to-transparent group-hover/chart:w-1/2 transition-all duration-700"></div>
    </div>
  );
}

/* ⭐ Add these styles to your global CSS file (if not already added) */
/*
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}
*/