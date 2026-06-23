import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

export const GraficoLineas = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.mes),
    datasets: [
      {
        label: "Total",
        data: data.map((item) => item.total),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e22",
        pointBackgroundColor: "#22c55e",
        pointRadius: 4,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-80 bg-(--surface-container) p-4 rounded-xl">
      <Line data={chartData} options={options} />
    </div>
  );
};
