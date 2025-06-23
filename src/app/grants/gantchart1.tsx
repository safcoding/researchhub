'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: { type: string; percentage: number; amount: number; count: number }[];
}

export default function GrantsPie({ data }: Props) {
  const colors = [
  '#2B9167', // Theme green
  '#F97316', // Orange
  '#3F83F8', // Blue
  '#FBBF24', // Yellow
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#10B981', // Teal
  '#E11D48'  // Red
];


  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const item = data[context.dataIndex];
            if (!item) return '';
            
            return [
              `${item.type}`,
              `Amount: RM${item.amount?.toLocaleString() || '0'}`,
              `Count: ${item.count || 0} grants`,
              `Percentage: ${item.percentage?.toFixed(1) || '0'}%`
            ];
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}