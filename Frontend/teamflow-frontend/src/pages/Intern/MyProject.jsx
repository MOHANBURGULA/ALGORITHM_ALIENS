import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Calendar,
  Clock,
  Target,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  FileText // Added for description icon
} from "lucide-react";

export default function MyProject() {
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const p = await api.get("/intern/my-project");
      const pr = await api.get("/intern/progress");

      setProject(p.data[0]);
      setProgress(pr.data.summary);
    };
    fetch();
  }, []);

  if (!project || !progress) return (
    <div className="space-y-6 p-2">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-[#2c274b] rounded mb-2"></div>
        <div className="h-4 w-32 bg-[#2c274b] rounded"></div>
      </div>
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 space-y-5">
        <div className="h-6 w-40 bg-[#2c274b] rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#2c274b] rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-[#2c274b] rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in progress':
        return <Hourglass className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in progress':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(project.deadline);

  return (
    <div className="space-y-8 p-2">
      {/* ⭐ HEADER - Enhanced */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#8b7cf6]/5 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h1>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                ${getStatusColor(project.status)}
              `}>
                {getStatusIcon(project.status)}
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">Project Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-sm text-[#8b7cf6]">Overview</span>
            </div>
          </div>
          
          {/* Days left badge */}
          <div className="group bg-[#2c274b] px-4 py-2 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
            <p className="text-xs text-gray-400">Time Remaining</p>
            <p className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8b7cf6] group-hover:scale-110 transition-transform" />
              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
            </p>
          </div>
        </div>
      </div>

      {/* ⭐ MAIN CARD - Enhanced */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg">
        
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#8b7cf6] rounded-full"></div>
          <h2 className="font-semibold text-lg">Project Overview</h2>
        </div>

        {/* ⭐ PROJECT DESCRIPTION - Added with icon and better styling */}
        <div className="bg-[#2c274b]/30 p-5 rounded-xl border border-white/5 mb-6 group hover:bg-[#2c274b]/40 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1f1b36] rounded-lg group-hover:scale-110 group-hover:bg-[#8b7cf6]/10 transition-all duration-300">
              <FileText className="w-4 h-4 text-[#8b7cf6]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">
                Project Description
              </p>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* ⭐ INFO CARDS - Enhanced grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InfoCard
            icon={<Calendar className="w-4 h-4" />}
            title="Start Date"
            value={new Date(project.created_at).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
            subtitle="Project commencement"
          />

          <InfoCard
            icon={<Clock className="w-4 h-4" />}
            title="Deadline"
            value={new Date(project.deadline).toLocaleDateString("en-GB", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
            subtitle={daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
            urgent={daysLeft < 7 && daysLeft > 0}
          />

          <InfoCard
            icon={<Target className="w-4 h-4" />}
            title="Progress"
            value={progress.completionPercentage + "%"}
            subtitle={`${progress.approvedSubmissions || 0} tasks completed`}
            highlight={true}
          />
        </div>

        {/* ⭐ PROGRESS BAR - Enhanced */}
        <div className="bg-[#2c274b]/30 p-5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#8b7cf6]" />
              <span className="text-sm font-medium">Overall Completion</span>
            </div>
            <span className="text-sm font-bold text-[#8b7cf6]">
              {progress.completionPercentage}%
            </span>
          </div>
          
          <div className="relative">
            <div className="h-3 bg-[#2c274b] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#8b7cf6] rounded-full transition-all duration-700 ease-out relative"
                style={{ width: progress.completionPercentage + "%" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            
            {/* Milestone markers */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Progress stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs text-gray-400">Completed</p>
              <p className="font-semibold text-green-400">{progress.approvedSubmissions || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Pending</p>
              <p className="font-semibold text-yellow-400">
                {(progress.totalSubmissions || 0) - (progress.approvedSubmissions || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Total</p>
              <p className="font-semibold text-[#8b7cf6]">{progress.totalSubmissions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card - Project Timeline */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8b7cf6]" />
          Project Timeline
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Start</span>
              <span className="text-white">
                {new Date(project.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="h-1 bg-[#2c274b] rounded-full">
              <div className="h-full w-1/2 bg-[#8b7cf6] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400">Today</span>
              <span className="text-gray-400">Deadline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ⭐ ENHANCED INFO CARD COMPONENT */
function InfoCard({ icon, title, value, subtitle, urgent, highlight }) {
  return (
    <div className={`
      group bg-[#2c274b] p-5 rounded-xl hover:bg-[#322d52] 
      transition-all duration-300 hover:shadow-lg 
      border border-transparent hover:border-white/5
      ${urgent ? 'animate-pulse' : ''}
      ${highlight ? 'ring-1 ring-[#8b7cf6]/20' : ''}
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          p-2.5 bg-[#1f1b36] rounded-lg 
          group-hover:scale-110 group-hover:bg-[#8b7cf6]/10 
          transition-all duration-300
          ${highlight ? 'text-[#8b7cf6]' : 'text-gray-400'}
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <p className={`
            font-semibold text-lg group-hover:text-white transition-colors
            ${highlight ? 'text-[#8b7cf6]' : ''}
          `}>
            {value}
          </p>
          {subtitle && (
            <p className={`
              text-xs mt-1 transition-colors
              ${urgent ? 'text-red-400' : 'text-gray-500 group-hover:text-gray-400'}
            `}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}