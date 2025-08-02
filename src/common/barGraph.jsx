import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({ activeMonth, darkMode = false }) => {
  const chartRef = useRef(null);

  // Extract and sanitize data
  const userJoinedInMonth =
    activeMonth?.map((month) =>
      Math.max(0, Array.isArray(month.joinedBy) ? month.joinedBy.length : 0)
    ) || Array(12).fill(0);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const totalUsers = userJoinedInMonth.reduce((acc, val) => acc + val, 0);

  if (totalUsers === 0) {
    return (
      <div
        className={`w-full p-6 rounded-xl shadow-sm border text-center text-lg ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-white border-gray-100 text-gray-500"
        }`}
      >
        No Analytics to show.
      </div>
    );
  }

  const data = {
    labels: months,
    datasets: [
      {
        label: "Users Joined",
        data: userJoinedInMonth,
        backgroundColor: darkMode ? "#3b82f6" : "#3b82f6", // blue-500
        hoverBackgroundColor: darkMode ? "#2563eb" : "#2563eb", // blue-600
        barThickness: 36, // Increased from 24 to 36 for wider bars
        categoryPercentage: 0.8, // Controls the ratio of bar width to available space (0-1)
        barPercentage: 0.9, // Controls the ratio of bar width to category width (0-1)
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: darkMode ? "#e5e7eb" : "#1f2937", // gray-200 : gray-800
          font: { size: 14, weight: "bold" },
        },
      },
      title: {
        display: true,
        text: "📊 Monthly User Join Statistics",
        font: { size: 18, weight: "bold" },
        color: darkMode ? "#93c5fd" : "#1e40af", // blue-300 : blue-900
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#374151" : "#1f2937", // gray-700 : gray-800
        titleColor: "#fff",
        bodyColor: darkMode ? "#d1d5db" : "#e5e7eb", // gray-300 : gray-200
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          font: { size: 14, weight: "bold" },
          color: darkMode ? "#9ca3af" : "#4b5563", // gray-400 : gray-600
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#4b5563", // gray-400 : gray-600
          font: { size: 14 },
        },
        grid: {
          display: false,
          color: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Users Joined",
          font: { size: 14, weight: "bold" },
          color: darkMode ? "#9ca3af" : "#4b5563", // gray-400 : gray-600
        },
        beginAtZero: true,
        suggestedMin: 0,
        ticks: {
          color: darkMode ? "#9ca3af" : "#4b5563", // gray-400 : gray-600
          font: { size: 18 },
          stepSize: 1,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  return (
    <div
      className={`w-full h-[400px] p-6 rounded-xl border shadow-sm ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}
    >
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;
