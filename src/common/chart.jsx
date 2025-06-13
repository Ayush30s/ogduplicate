import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const DoughnutChart = ({
  labels,
  data,
  title,
  colors = [
    "#ced6e2", // Light Blue
    "#829abf", // Soft Blue
    "#3c629b", // Baby Blue
    "#2a69c9", // Bright Blue
    "#063f96", // Medium Blue
    "#062b63", // Dark Blue
    "#0547fc", // Deep Navy Blue
    "#7e82ea", // Charcoal Blue
    "#6267ea", // Darkest Blue
  ],
  borderColor = "#1E3A8A", // Darker border color for better separation
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!labels || !data || labels.length === 0 || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.slice(0, 9),
        datasets: [
          {
            label: title,
            data: data.slice(0, 9),
            backgroundColor: colors.slice(0, 9),
            borderColor: borderColor, // Darker border color
            borderWidth: 2, // Ensures segment separation
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "white", // Medium Dark Blue for legend text
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
            },
            color: "#d5dce8", // Dark Blue for title
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);

                if (total > 0) {
                  const percentage = ((value / total) * 100).toFixed(2); // Fix decimal places
                  return `${label}: ${percentage}%`;
                } else {
                  return `${label}: ${value+"%"}`;
                }
              },
            },
          },
        },
        cutout: "50%",
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, data, title, colors, borderColor]);

  if (!labels || !data || labels.length === 0 || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-100">No data available</div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
};

const AnalyticsDashboard = ({ title, labels, data }) => {
  return (
    <div className="bg-blue-[#1d2634] p-4 rounded-lg shadow">
      <DoughnutChart labels={labels} data={data} title={title} />
    </div>
  );
};

export default AnalyticsDashboard;
