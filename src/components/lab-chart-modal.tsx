import { useState, useMemo } from 'react';
import { type Lab } from '@/hooks/lab-logic';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
  ArcElement,
  Filler
);

interface LabChartModalProps {
  labs: Lab[];
  onClose: () => void;
}

export function LabChartModal({ labs, onClose }: LabChartModalProps) {
  const [chartType, setChartType] = useState<'pie' | 'line'>('pie');

  // Generate pie chart data for lab distribution by department
  const generateDepartmentPieData = useMemo(() => {
    const departmentCounts: Record<string, number> = {};
      labs.forEach(lab => {
      const department = lab.DEPARTMENT ?? 'Unknown';
      departmentCounts[department] = (departmentCounts[department] ?? 0) + 1;
    });

    const data = Object.keys(departmentCounts).map(dept => ({
      department: dept,
      count: departmentCounts[dept]
    }));

    return {
      labels: data.map(item => item.department),
      datasets: [
        {
          data: data.map(item => item.count),
          backgroundColor: [
            '#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA', 
            '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
            '#22C55E', '#10B981', '#34D399', '#6EE7B7',
            '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    };
  }, [labs]);

  // Generate line chart data for lab status distribution
  const generateStatusLineData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
      labs.forEach(lab => {
      const status = lab.LAB_STATUS ?? 'Unknown';
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const values = Object.values(statusCounts);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Labs',
          data: values,
          borderColor: '#1E40AF',
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#1E40AF',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [labs]);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Lab Distribution by Department',
        font: {
          size: 16
        }
      },
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed?: number; dataset?: { data: number[] } }) => {
            const label = context.label ?? '';
            const value = context.parsed ?? 0;
            const total = context.dataset?.data.reduce((a: number, b: number) => a + b, 0) ?? 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} labs (${percentage}%)`;
          }
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Lab Count by Status',
        font: {
          size: 16
        }
      },
      legend: {
        display: false
      },      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed?: { y: number } }) => {
            return `${context.label}: ${context.parsed?.y ?? 0} labs`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Number of Labs'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Lab Status'
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Laboratory Statistics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Chart Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartType('pie')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  chartType === 'pie'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Department Distribution
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Status Overview
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-96 flex items-center justify-center">
            {labs.length === 0 ? (
              <div className="text-center text-gray-500">
                <p className="text-lg">No lab data available</p>
                <p className="text-sm">Add some labs to see statistics</p>
              </div>
            ) : (
              <>
                {chartType === 'pie' && (
                  <div className="w-full h-full">
                    <Pie data={generateDepartmentPieData} options={pieChartOptions} />
                  </div>
                )}
                {chartType === 'line' && (
                  <div className="w-full h-full">
                    <Line data={generateStatusLineData} options={lineChartOptions} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{labs.length}</div>
              <div className="text-sm text-gray-600">Total Labs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {labs.filter(lab => lab.LAB_STATUS === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Labs</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {new Set(labs.map(lab => lab.DEPARTMENT).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(labs.map(lab => lab.LAB_TYPE).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-600">Lab Types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
