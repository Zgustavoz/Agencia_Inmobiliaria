import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const GraficoBarras = ({ data }) => {
  return (
    <div className="w-full h-80 bg-(--surface-container) p-4 rounded-xl">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};