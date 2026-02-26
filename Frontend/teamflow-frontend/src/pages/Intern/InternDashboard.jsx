import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Folder,
  FileText,
  CheckCircle,
  BarChart
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function InternDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/intern/progress");
      setData(res.data);
    };
    fetch();
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Loading dashboard...</div>
    </div>
  );

  const { summary, timelineTracker, submissionConsistency } = data;

  /* ⭐ FIX postgres string -> number */
  const chartData =
    submissionConsistency?.map((item) => ({
      week: item.week,
      submissions: Number(item.submissions)
    })) || [];

  return (
    <div className="space-y-8 p-2">
      {/* ⭐ CARDS - Enhanced with hover effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card icon={<Folder className="w-6 h-6" />} title="Current Projects" value={summary.activeProjects} />
        <Card icon={<FileText className="w-6 h-6" />} title="Total Submissions" value={summary.totalSubmissions} />
        <Card icon={<CheckCircle className="w-6 h-6" />} title="Approved" value={summary.approvedSubmissions} />
        <Card icon={<BarChart className="w-6 h-6" />} title="Completion %" value={summary.completionPercentage + "%"} />
      </div>

      {/* ⭐ WEEKLY PERFORMANCE CHART - Enhanced styling */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#8b7cf6] rounded-full"></span>
            Weekly Performance
          </h2>
          {chartData.length > 0 && (
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              Last {chartData.length} weeks
            </span>
          )}
        </div>

        {chartData.length === 0 ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-gray-400 bg-white/5 rounded-xl">
            <BarChart className="w-12 h-12 mb-3 opacity-50" />
            <p>No submissions yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="week" 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#2c274b', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ color: '#8b7cf6', fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#8b7cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#8b7cf6', strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#8b7cf6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ⭐ TIMELINE TRACKER - Enhanced with hover effects */}
      <div className="bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-6 bg-[#8b7cf6] rounded-full"></span>
            Timeline Tracker
          </h2>
          {timelineTracker?.length > 0 && (
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {timelineTracker.length} submissions
            </span>
          )}
        </div>

        {timelineTracker?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white/5 rounded-xl">
            <FileText className="w-12 h-12 mb-3 opacity-50" />
            <p>No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timelineTracker.map((t, index) => (
              <div
                key={t.id}
                className="group bg-[#2c274b] p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#322d52] transition-all duration-300 hover:shadow-lg border border-transparent hover:border-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1f1b36] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-4 h-4 text-[#8b7cf6]" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-white transition-colors">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <span>Submitted:</span>
                      <span className="text-gray-300">
                        {new Date(t.submitted_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      t.status === "Approved"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 group-hover:bg-green-500/30"
                        : t.status === "Rejected"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 group-hover:bg-yellow-500/30"
                    }`}
                  >
                    {t.status}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ⭐ CARD COMPONENT - Enhanced with hover effects */
function Card({ icon, title, value }) {
  return (
    <div className="group bg-[#1f1b36] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <h2 className="text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left">
            {value}
          </h2>
        </div>
        <div className="text-[#8b7cf6] bg-white/5 p-3 rounded-xl group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-[#8b7cf6]/20 rounded-full group-hover:w-full transition-all duration-700"></div>
      </div>
    </div>
  );
}