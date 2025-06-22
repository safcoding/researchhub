'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: { type: string; percentage: number; amount: number; count: number }[];
}

export default function GrantsPie({ data }: Props) {
  const colors = [
    '#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA', 
    '#9061F9', '#C084FC', '#F472B6', '#FB7185'
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