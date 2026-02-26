import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#6c5ce7", "#8b7cf6", "#a29bfe", "#b2bec3"];

export default function DonutChart({ data }) {
  return (
    <PieChart width={320} height={250}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={70}
        outerRadius={100}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}