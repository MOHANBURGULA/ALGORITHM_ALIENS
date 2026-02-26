import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function ProjectChart({ data }) {
  // Default colors for different statuses
  const getBarColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // yellow
      case 'rejected':
        return '#ef4444'; // red
      case 'in progress':
        return '#8b7cf6'; // purple
      case 'completed':
        return '#6c5ce7'; // darker purple
      default:
        return '#8b7cf6';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex flex-col items-center justify-center bg-[#1f1b36] rounded-xl border border-white/5">
        <BarChart className="w-12 h-12 text-gray-500 mb-3" />
        <p className="text-gray-400 text-sm">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40}
          barGap={8}
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b7cf6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity={0.8}/>
            </linearGradient>
          </defs>

          {/* X Axis - Enhanced */}
          <XAxis 
            dataKey="status" 
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
            axisLine={{ stroke: '#333', strokeWidth: 1 }}
            tickLine={{ stroke: '#333' }}
            dy={10}
          />

          {/* Y Axis - Enhanced */}
          <YAxis 
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
            axisLine={{ stroke: '#333', strokeWidth: 1 }}
            tickLine={{ stroke: '#333' }}
            dx={-10}
            allowDecimals={false}
          />

          {/* Tooltip - Enhanced */}
          <Tooltip
            cursor={{ fill: 'rgba(139, 124, 246, 0.1)' }}
            contentStyle={{
              backgroundColor: "#1f1b36",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              padding: "12px 16px"
            }}
            labelStyle={{ 
              color: "#8b7cf6", 
              fontWeight: 600,
              fontSize: "14px",
              marginBottom: "4px"
            }}
            itemStyle={{
              color: "#fff",
              fontSize: "13px",
              padding: "4px 0"
            }}
          />

          {/* Bar - Enhanced with conditional colors */}
          <Bar 
            dataKey="count" 
            radius={[8, 8, 0, 0]}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.status)}
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(139, 124, 246, 0.2))',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.filter = 'drop-shadow(0 6px 8px rgba(139, 124, 246, 0.4))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = 'drop-shadow(0 4px 6px rgba(139, 124, 246, 0.2))';
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend - Optional but nice */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getBarColor(item.status) }}
            />
            <span className="text-xs text-gray-400">
              {item.status}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}