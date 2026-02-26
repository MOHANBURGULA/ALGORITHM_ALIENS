import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProjectChart from "../../components/Charts/BarChart";
import PerformanceChart from "../../components/Charts/LineChart";
import { Users, FolderKanban, TrendingUp, Award } from "lucide-react";

export default function CeoDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/ceo/analytics-dashboard");
      setData(res.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6c5ce7] border-t-transparent"></div>
    </div>
  );

  /* ⭐ map backend → frontend structure */
  const interns = data.totals?.interns;
  const projects = data.totals?.projects;
  const activeProjects = data.totals?.activeProjects;
  const completionRate = data.progressTracking?.completionPercentage;

  /* ⭐ NEW growth mapping */
  const internGrowth = data.growth?.internGrowth ?? 0;
  const projectGrowth = data.growth?.projectGrowth ?? 0;
  const completionGrowth = data.growth?.completionGrowth ?? 0;

  const performanceTrend = data.submissionTrends?.daily?.map(d => ({
    month: new Date(d.day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    value: Number(d.total)
  }));

  const projectStatus = [
    { status: "Active", count: data.totals?.activeProjects },
    { status: "Completed", count: data.totals?.completedProjects }
  ];

  const teamLeadPerformance = data.teamPerformance?.map(tl => {
    const name =
      tl.teamlead ??
      tl.teamLead ??
      tl.name ??
      "Team Lead";

    const approved =
      Number(tl.approvedsubmissions ?? tl.approvedSubmissions ?? 0);

    const total =
      Number(tl.totalsubmissions ?? tl.totalSubmissions ?? 0);

    return {
      name,
      interns: Number(tl.interns ?? 0),
      projects: Number(tl.projects ?? 0),
      progress: total === 0 ? 0 : Math.round((approved / total) * 100)
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ⭐ 4 Cards with Enhanced Hover Effects */}
      <div className="grid grid-cols-4 gap-6">
        <Card icon={<Users />} title="Total Interns" value={interns} growth={`${internGrowth}%`} />
        <Card icon={<FolderKanban />} title="Active Projects" value={activeProjects} growth={`${projectGrowth}%`} />
        <Card icon={<TrendingUp />} title="Completion Rate" value={`${completionRate}%`} growth={`${completionGrowth}%`} />
        <Card icon={<Award />} title="Team Performance" value={`${data.progressTracking?.productivityScore}/100`} />
      </div>

      {/* ⭐ Graphs with Enhanced Containers */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Team Performance Trend">
          <PerformanceChart data={performanceTrend} />
        </ChartCard>

        <ChartCard title="Project Progress Overview">
          <ProjectChart data={projectStatus} />
        </ChartCard>
      </div>

      {/* ⭐ Enhanced Table with Professional Animations */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl hover-card border border-transparent hover:border-[#6c5ce7]/20 transition-all duration-500">
        <h3 className="mb-6 font-semibold flex items-center gap-2">
          <span className="w-1 h-6 bg-[#6c5ce7] rounded-full animate-pulse"></span>
          Team Leads Performance
        </h3>

        <div className="flex justify-between text-gray-400 text-sm mb-4 px-2 border-b border-white/5 pb-3">
          <p className="w-[200px]">Team Lead</p>
          <p className="w-[60px] text-center">Interns</p>
          <p className="w-[60px] text-center">Projects</p>
          <p className="w-[250px] text-center">Performance</p>
        </div>

        <div className="space-y-3">
          {teamLeadPerformance?.map((tl, i) => {
            const progress = Number(tl.performancescore ?? tl.progress ?? 0);

            return (
              <div 
                key={i} 
                className="flex items-center justify-between group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >

                <div className="flex items-center gap-3 w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center font-bold group-hover/item:scale-110 transition-transform duration-300 group-hover/item:shadow-lg group-hover/item:shadow-[#6c5ce7]/20">
                    {tl.name?.[0] ?? "T"}
                  </div>
                  <p className="group-hover/item:text-white transition-colors duration-300">{tl.name}</p>
                </div>

                <p className="w-[60px] text-center group-hover/item:scale-110 transition-transform duration-300">{Number(tl.interns) || 0}</p>
                <p className="w-[60px] text-center group-hover/item:scale-110 transition-transform duration-300">{Number(tl.projects) || 0}</p>

                <div className="w-[250px] group/progress">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-[#6c5ce7] rounded-full transition-all duration-700 ease-out group-hover/progress:shadow-[0_0_10px_#6c5ce7]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right group-hover/item:text-[#6c5ce7] transition-colors duration-300">{progress}%</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ⭐ ENHANCED Card Component with Professional Hover Effects */
function Card({ icon, title, value, growth }) {
  const isPositive = Number(growth) >= 0;

  return (
    <div className="bg-[#1f1b36] p-6 rounded-2xl flex items-center gap-4 group/card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 border border-transparent hover:border-[#6c5ce7]/20">
      <div className="bg-[#6c5ce7] p-3 rounded-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300 group-hover/card:shadow-lg group-hover/card:shadow-[#6c5ce7]/30">
        <div className="group-hover/card:animate-pulse">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-gray-400 text-sm group-hover/card:text-gray-300 transition-colors duration-300">{title}</p>
        <h2 className="text-xl font-bold group-hover/card:scale-105 origin-left transition-transform duration-300">{value}</h2>

        {growth !== undefined && (
          <span className={`text-xs inline-block mt-1 ${isPositive ? "text-green-400" : "text-red-400"} group-hover/card:translate-x-1 transition-transform duration-300`}>
            {isPositive ? "+" : ""}{growth} vs last month
          </span>
        )}
      </div>
    </div>
  );
}

/* ⭐ ENHANCED ChartCard Component with Professional Animations */
function ChartCard({ title, children }) {
  return (
    <div className="bg-[#1f1b36] p-6 rounded-2xl group/chart hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#6c5ce7]/10 border border-transparent hover:border-[#6c5ce7]/20">
      <h3 className="mb-4 font-semibold flex items-center gap-2">
        <span className="w-1 h-5 bg-[#6c5ce7] rounded-full group-hover/chart:h-6 transition-all duration-300"></span>
        {title}
      </h3>
      <div className="group-hover/chart:scale-[1.02] transition-transform duration-500">
        {children}
      </div>
    </div>
  );
}

/* ⭐ Add these styles to your global CSS file (index.css or App.css) */
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

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

.hover-card {
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(108, 92, 231, 0.1), 0 10px 10px -5px rgba(108, 92, 231, 0.04);
}
*/