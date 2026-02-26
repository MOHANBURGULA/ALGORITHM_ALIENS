import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function PerformanceChart({data}){
  return(
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month"/>
        <YAxis/>
        <Tooltip
  contentStyle={{
    background:"#1f1b36",
    border:"none",
    borderRadius:"10px"
  }}
/>
        <Line type="monotone" dataKey="value" stroke="#8884d8"/>
      </LineChart>
    </ResponsiveContainer>
  );
}