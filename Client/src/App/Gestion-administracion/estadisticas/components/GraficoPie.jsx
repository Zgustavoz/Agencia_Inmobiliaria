import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Legend, Tooltip);

export const GraficoPie = ({ data }) => {
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
  const chartData = {
    labels: data.map((item) => item.zona),
    datasets: [
      {
        data: data.map((item) => item.cantidad),
        backgroundColor: data.map((_, index) => COLORS[index % COLORS.length]),
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    cutout: "45%",
  };

  return (
    <div className="w-full h-80 bg-(--surface-container) p-4 rounded-xl">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
