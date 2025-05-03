// src/app/grant/gantchart1.tsx
'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: { type: string; percentage: number }[];
}

export default function GrantsPie({ data }: Props) {
  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: ['#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA'],
        borderWidth: 0,
      },
    ],
  };

  return <Pie data={chartData} />;
}
