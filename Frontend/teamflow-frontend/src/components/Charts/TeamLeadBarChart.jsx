import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TeamLeadBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            background: "#1f1b36",
            border: "none",
            borderRadius: "10px"
          }}
        />
        <Bar dataKey="totalsubmissions" fill="#8884d8" />
        <Bar dataKey="latesubmissions" fill="#d1d5db" />
      </BarChart>
    </ResponsiveContainer>
  );
}