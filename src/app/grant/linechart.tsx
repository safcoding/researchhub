// src/app/grant/LineChart.tsx
'use client';
import { Line } from 'react-chartjs-2';
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

interface LineChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export default function LineChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Grant Amount (RM)',
        data: data.values,
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1E40AF',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `RM${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          color: '#6B7280',
          callback: function (tickValue: string | number) {
            // Ensure tickValue is treated as a number
            return `RM${Number(tickValue).toLocaleString()}K`;
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}