import { useEffect, useState } from "react";
import api from "../../api/axios";
import TeamLeadBarChart from "../../components/Charts/TeamLeadBarChart";
import { 
  Users, 
  FolderKanban, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Target
} from "lucide-react";

export default function TeamLeadDashboard() {
  const [data, setData] = useState(null);

  const fetch = async () => {
    const res = await api.get("/teamlead/dashboard-full");
    setData(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (!data) return (
    <div className="space-y-8 p-2">
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-[#1f1b36] p-6 rounded-2xl animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2c274b] rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-[#2c274b] rounded"></div>
                <div className="h-6 w-16 bg-[#2c274b] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#1f1b36] p-6 rounded-2xl h-64 animate-pulse"></div>
      <div className="bg-[#1f1b36] p-6 rounded-2xl h-48 animate-pulse"></div>
    </div>
  );

  const chartData = data.performanceGraphData.map((i) => ({
    name: i.intern,
    totalsubmissions: Number(i.totalsubmissions),
    latesubmissions: Number(i.latesubmissions),
  }));

  const completeProject = async (id) => {
    await api.put(`/teamlead/complete/${id}`);
    fetch();
  };
  return (
    <div className="space-y-8 p-2">
      {/* Header with decorative element */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#8b7cf6] rounded-full"></span>
            Team Lead Dashboard
          </h1>
          <p className="text-gray-400 mt-2 ml-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Monitor intern performance and project progress
          </p>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          icon={<Users className="w-6 h-6" />} 
          title="My Interns" 
          value={data.cards.interns}
          subtitle="Active members"
          color="from-blue-500/20 to-blue-500/0"
        />
        <Card 
          icon={<FolderKanban className="w-6 h-6" />} 
          title="Active Projects" 
          value={data.cards.activeProjects}
          subtitle="In progress"
          color="from-purple-500/20 to-purple-500/0"
        />
        <Card 
          icon={<CheckCircle className="w-6 h-6" />} 
          title="Approved Submissions" 
          value={data.cards.completedTasks}
          subtitle="Completed tasks"
          color="from-green-500/20 to-green-500/0"
        />
        <Card 
          icon={<Clock className="w-6 h-6" />} 
          title="Pending Reviews" 
          value={data.cards.pendingReviews}
          subtitle="Awaiting review"
          color="from-yellow-500/20 to-yellow-500/0"
        />
      </div>

      {/* ⭐ GRAPH - Enhanced */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8b7cf6]" />
            <h3 className="font-semibold">Intern Performance Analytics</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6c5ce7] rounded-full"></div>
              <span className="text-xs text-gray-400">Total Submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#8b7cf6] rounded-full"></div>
              <span className="text-xs text-gray-400">Late Submissions</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <TeamLeadBarChart data={chartData} />
        </div>
      </div>

      {/* ⭐ ACTIVE PROJECTS - Enhanced */}
      <div className="bg-[#1f1b36] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-[#1f1b36]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#8b7cf6]" />
            <h3 className="font-semibold">Active Projects</h3>
          </div>
          <span className="text-xs bg-[#8b7cf6]/20 text-[#8b7cf6] px-3 py-1 rounded-full">
            {data.activeProjectsList.length} ongoing
          </span>
        </div>

        <div className="p-6">
          {data.activeProjectsList.length === 0 ? (
            <div className="text-center py-8">
              <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No active projects</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.activeProjectsList.map((p, index) => {
                const progress = p.total == 0 ? 0 : Math.round((p.approved / p.total) * 100);
                const isComplete = progress === 100;

                return (
                  <div 
                    key={p.id} 
                    className="group bg-[#2c274b] rounded-xl p-5 hover:bg-[#322d52] transition-all duration-300 border border-white/5 hover:border-white/10"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold group-hover:text-white transition-colors">
                            {p.title}
                          </h4>
                          {isComplete && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        {/* Progress Bar */}

                      </div>

                      {/* Complete Button */}
                      {!isComplete && (
                        <button
                          onClick={() => completeProject(p.id)}
                          className="group/btn px-4 py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-xl transition-all duration-300 flex items-center gap-2 border border-green-500/30 hover:border-green-500/50"
                        >
                          <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          Complete Project
                          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Achievement Card */}
      <div className="bg-gradient-to-r from-[#6c5ce7]/20 to-[#8b7cf6]/20 rounded-2xl p-6 border border-[#8b7cf6]/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#8b7cf6]/20 rounded-xl">
            <Award className="w-8 h-8 text-[#8b7cf6]" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Team Achievement</h3>
            <p className="text-sm text-gray-300">
              {data.cards.completedTasks} tasks completed • {data.cards.interns} active interns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ⭐ ENHANCED CARD COMPONENT */
function Card({ icon, title, value, subtitle, color }) {
  return (
    <div className="group bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className={`
          p-3 bg-gradient-to-br from-[#6c5ce7] to-[#8b7cf6] rounded-xl 
          group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
          shadow-lg
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <h2 className="text-2xl font-bold group-hover:text-white transition-colors">
            {value}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Decorative element */}
        <div className="w-1 h-1 rounded-full bg-[#8b7cf6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      {/* Progress indicator line */}
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full group-hover:w-full transition-all duration-700"></div>
      </div>
    </div>
  );
}