import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const GraficoLineas = ({ data }) => {
  return (
    <div className="w-full h-80 bg-(--surface-container) p-4 rounded-xl">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};