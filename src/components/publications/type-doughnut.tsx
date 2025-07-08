import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Loader2 } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend);

interface TypeDoughnutChartsProps {
  typeCounts: Record<string, number>;
  loading?: boolean;
}

export default function TypeDoughnutCharts({ typeCounts, loading }: TypeDoughnutChartsProps) {
  // Prepare data for type chart
  const typeLabels = Object.keys(typeCounts);
  const typeData = Object.values(typeCounts);

  // Simple color palette
  const palette = [
    '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B2FF66', '#FF66B2', '#66FFB2', '#B266FF', '#FFB266'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
        <Pie
          data={{
            labels: typeLabels,
            datasets: [
              {
                data: typeData,
                backgroundColor: palette,
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              legend: { display: true, position: 'bottom' },
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
  );
}
