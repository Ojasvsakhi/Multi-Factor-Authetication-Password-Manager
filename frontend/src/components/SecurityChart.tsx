import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(17, 25, 40, 0.9)',
      titleColor: '#22d3ee',
      bodyColor: '#ffffff',
      borderColor: '#22d3ee',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(34, 211, 238, 0.1)',
      },
      ticks: {
        color: 'rgba(34, 211, 238, 0.5)',
        font: {
          family: 'Inter',
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(34, 211, 238, 0.1)',
      },
      ticks: {
        color: 'rgba(34, 211, 238, 0.5)',
        font: {
          family: 'Inter',
        },
      },
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = {
  labels,
  datasets: [
    {
      data: [65, 78, 72, 85, 82, 92],
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

export const SecurityChart: React.FC = () => {
  return (
    <div className="h-64">
      <Line options={options} data={data} />
    </div>
  );
};