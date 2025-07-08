import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Loader2 } from "lucide-react";

Chart.register(ArcElement, Tooltip, Legend);

interface CategoryDoughnutChartProps {
  categoryCounts: Record<string, number>;
  loading?: boolean;
}

export default function CategoryDoughnutChart({ categoryCounts, loading }: CategoryDoughnutChartProps) {
  const categoryLabels = Object.keys(categoryCounts);
  const categoryData = Object.values(categoryCounts);
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
            labels: categoryLabels,
            datasets: [
              {
                data: categoryData,
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
