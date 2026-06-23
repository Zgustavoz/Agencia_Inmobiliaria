import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);

export const GraficoBarras = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.mes),
    datasets: [
      {
        label: "Total",
        data: data.map((item) => item.total),
        backgroundColor: "#4f46e5",
        borderRadius: 12,
        borderSkipped: false,
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
      <Bar data={chartData} options={options} />
    </div>
  );
};
