"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Loader2 } from "lucide-react";
import { GrantLogic } from "@/hooks/logic/grant-logic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type TimeRange = "year" | "quarter";

export default function CumulativeGrantsGraph() {
  const { fetchGrantStatsForYear, fetchAvailableYears } = GrantLogic();
  const [chartData, setChartData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("year");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getYears = async () => {
      setLoading(true);
      const years = await fetchAvailableYears();
      if (!isMounted) return;
      setAvailableYears(years);
      if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(typeof years[0] === 'number' ? years[0] : new Date().getFullYear());
      }
      setLoading(false);
    };
    getYears();
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      setLoading(true);
      const stats = await fetchGrantStatsForYear(selectedYear);
      if (!isMounted) return;
      let labels: string[] = [];
      let months: string[] = [];
      let data: number[] = [];

      if (timeRange === "year") {
        for (let i = 0; i < 12; i++) {
          const d = new Date(selectedYear, i, 1);
          labels.push(d.toLocaleString("default", { month: "short" }));
          months.push(`${selectedYear}-${String(i + 1).padStart(2, "0")}`);
        }
      } else if (timeRange === "quarter") {
        const startMonth = (selectedQuarter - 1) * 3;
        labels = [];
        months = [];
        for (let i = 0; i < 3; i++) {
          const monthIdx = startMonth + i;
          const d = new Date(selectedYear, monthIdx, 1);
          labels.push(d.toLocaleString("default", { month: "short", year: "2-digit" }));
          months.push(`${selectedYear}-${String(monthIdx + 1).padStart(2, "0")}`);
        }
      }

      // Cumulative sum of monthly grant amounts (in thousands)
      let cumulative = 0;
      data = months.map((month) => {
        const amount = stats.monthlyAmounts?.[month] || 0;
        cumulative += amount / 1000; // convert to thousands for display
        return cumulative;
      });

      setChartData({
        labels,
        datasets: [
          {
            label:
              timeRange === "year"
                ? `Cumulative Grant Amount (RM '000) - ${selectedYear}`
                : `Cumulative Grant Amount (RM '000) - Q${selectedQuarter} ${selectedYear}`,
            data,
            fill: false,
            borderColor: "#2B9167",
            backgroundColor: "rgba(30, 64, 175, 0.1)",
            tension: 0.1,
          },
        ],
      });
      setLoading(false);
    };
    getData();
    return () => { isMounted = false; };
  }, [fetchGrantStatsForYear, timeRange, selectedYear, selectedQuarter]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-72">
          <Loader2 className="animate-spin w-8 h-8 mr-2" />
          <span>Loading...</span>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) return <Card className="w-full"><CardContent>Loading...</CardContent></Card>;

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 md:px-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle>
            {timeRange === "year"
              ? `Cumulative Grant Amount (${selectedYear})`
              : `Cumulative Grant Amount (Q${selectedQuarter} ${selectedYear})`}
          </CardTitle>
          <CardDescription>
            Shows the cumulative amount of grants received for the selected range.
          </CardDescription>
        </CardHeader>
        <CardAction>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Time range toggle group (desktop) */}
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={val => val && setTimeRange(val as TimeRange)}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="year">Past Year</ToggleGroupItem>
              <ToggleGroupItem value="quarter">Quarter</ToggleGroupItem>
            </ToggleGroup>
            {/* Time range select (mobile) */}
            <Select value={timeRange} onValueChange={val => setTimeRange(val as TimeRange)}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Past Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="year" className="rounded-lg">
                  Past Year
                </SelectItem>
                <SelectItem value="quarter" className="rounded-lg">
                  Quarter
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Year select appears for both year and quarter */}
            {(timeRange === "year" || timeRange === "quarter") && (
              <Select
                value={String(selectedYear)}
                onValueChange={val => setSelectedYear(Number(val))}
              >
                <SelectTrigger
                  className="flex w-32"
                  size="sm"
                  aria-label="Select year"
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {availableYears.map(year => (
                    <SelectItem key={year} value={String(year)} className="rounded-lg">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {/* Quarter select appears only for quarter */}
            {timeRange === "quarter" && (
              <Select
                value={String(selectedQuarter)}
                onValueChange={val => setSelectedQuarter(Number(val) as 1 | 2 | 3 | 4)}
              >
                <SelectTrigger
                  className="flex w-32"
                  size="sm"
                  aria-label="Select quarter"
                >
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {[1, 2, 3, 4].map(q => (
                    <SelectItem key={q} value={String(q)} className="rounded-lg">
                      Q{q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardAction>
        <CardContent>
          <div className="h-72 w-full min-w-0">
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: "top" },
                title: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }}
            style={{ width: "100%", height: "100%" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
