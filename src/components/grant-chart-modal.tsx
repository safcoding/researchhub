import { useState, useMemo } from 'react';
import type { Grant } from '@/hooks/grant-logic';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { TooltipItem } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartModalProps {
  grants: Grant[];
  onClose: () => void;
}

export function GrantChartModal({ grants, onClose }: ChartModalProps) {
  const [chartType, setChartType] = useState<'pie' | 'line'>('line');

  // Function to generate line chart data by date
  const generateLineChartData = () => {
    // Group by month and year
    const monthlyData: Record<string, number> = {};
    
    grants.forEach(grant => {
      if (grant.PRO_DATESTART) {
        const date = new Date(grant.PRO_DATESTART);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthlyData[monthYear] = (monthlyData[monthYear] ?? 0) + (grant.PRO_APPROVED ?? 0);
      }
    });
    
    // Sort by date
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Format for display
    const formattedLabels = sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      if (!year || !month) return 'Unknown';
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Grant Amount (RM)',
          data: sortedMonths.map(month => monthlyData[month]),
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
  };

  // Calculate pie chart data and tooltip map using useMemo to avoid side effects during render
  const { pieData, tooltipDataMap } = useMemo(() => {
    // Group by grant type
    const grantTypeAmount: Record<string, number> = {};
    let totalAmount = 0;
    
    grants.forEach(grant => {
      const grantType = grant.GRANT_TYPE ?? 'Unknown';
      grantTypeAmount[grantType] ??= 0;
      grantTypeAmount[grantType] += (grant.PRO_APPROVED ?? 0);
      totalAmount += (grant.PRO_APPROVED ?? 0);
    });
    
    const newTooltipDataMap = new Map<string, { amount: number; isCount: boolean }>();
    
    // Handle case where totalAmount is 0 or very small
    if (totalAmount === 0) {
      // If no grants have amounts, show grant counts instead
      const grantTypeCounts: Record<string, number> = {};
      grants.forEach(grant => {
        const grantType = grant.GRANT_TYPE ?? 'Unknown';
        grantTypeCounts[grantType] = (grantTypeCounts[grantType] ?? 0) + 1;
      });
      
      const totalCount = grants.length;
      const data = Object.keys(grantTypeCounts).map(type => {
        const count = grantTypeCounts[type] ?? 0;
        newTooltipDataMap.set(type, { amount: count, isCount: true });
        return {
          type,
          percentage: Math.round((count / totalCount) * 100),
          amount: count,
          isCount: true
        };
      });
      
      return {
        pieData: {
          labels: data.map(item => item.type),
          datasets: [
            {
              data: data.map(item => item.percentage),
              backgroundColor: [
                '#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA', 
                '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
                '#22C55E', '#10B981', '#34D399', '#6EE7B7'
              ],
              borderWidth: 0,
            },
          ],
          // Store the original amounts/counts for the tooltip
          amounts: data.map(item => item.amount),
          isCount: true
        },
        tooltipDataMap: newTooltipDataMap
      };
    }
    
    // Convert to percentages, filter out zero amounts
    const grantTypes = Object.keys(grantTypeAmount).filter(type => (grantTypeAmount[type] ?? 0) > 0);
    const data = grantTypes.map(type => {
      const amount = grantTypeAmount[type] ?? 0;
      newTooltipDataMap.set(type, { amount, isCount: false });
      return {
        type,
        percentage: totalAmount > 0 ? Math.max(1, Math.round((amount / totalAmount) * 100)) : 0,
        amount
      };
    });
    
    return {
      pieData: {
        labels: data.map(item => item.type),
        datasets: [
          {
            data: data.map(item => item.percentage),
            backgroundColor: [
              '#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA', 
              '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
              '#22C55E', '#10B981', '#34D399', '#6EE7B7'
            ],
            borderWidth: 0,
          },
        ],
        // Store the original amounts for the tooltip
        amounts: data.map(item => item.amount),
        isCount: false
      },
      tooltipDataMap: newTooltipDataMap    };
  }, [grants]);

  // Generate line chart data
  const lineData = generateLineChartData();
  
  // Create chart options with proper closure for tooltip data
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: pieData.isCount ? 'Grant Distribution by Type (Count)' : 'Grant Distribution by Type (Amount)',
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
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const label = tooltipItem.label ?? '';
            const value = Number(tooltipItem.raw) ?? 0;
            
            // Get tooltip data from the reliable Map
            const tooltipData = tooltipDataMap.get(label);
            
            if (!tooltipData) {
              console.warn('No tooltip data found for label:', label);
              return `${label}: ${value}%`;
            }
            
            const { amount, isCount } = tooltipData;
            
            // Check if we're showing counts or amounts
            if (isCount) {
              const grantCount = amount;
              return `${label}: ${value}% (${grantCount} grant${grantCount !== 1 ? 's' : ''})`;
            } else {
              return `${label}: ${value}% (RM${amount.toLocaleString()})`;
            }
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
        text: 'Grant Amounts Over Time',
        font: {
          size: 16
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: { raw?: unknown }) => {
            return `RM${Number(context.raw).toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (RM)'
        },
        ticks: {
          callback: (value: string | number) => `RM${Number(value).toLocaleString()}`
        }
      }
    }
  } as const;

  if (grants.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Grant Charts</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chart modal"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 text-center">No grant data available for visualization.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Grant Charts</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close chart modal"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Pie Chart
            </button>
          </div>
        </div>
        
        <div className="h-[500px] w-full">
          {chartType === 'pie' ? (
            <Pie data={pieData} options={pieChartOptions} />
          ) : (
            <Line data={lineData} options={lineChartOptions} />
          )}
        </div>
      </div>
    </div>
  );
}