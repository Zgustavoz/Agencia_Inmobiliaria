import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export const GraficoPie = ({ data }) => {
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="w-full h-80 bg-(--surface-container) p-4 rounded-xl">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="cantidad" nameKey="zona" outerRadius={100}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};