"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import StatsCard from "@/components/statsCard"

interface GrantChartsProps {
  cumulativeData: Array<{
    month: string
    total: number
  }>
  sponsorData: Array<{
    category: string
    amount: number
    count: number
  }>
  typeData: Array<{
    type: string
    count: number
  }>
  currentYear: number
  totalAmount: number
  totalGrants: number
  allTimeTotalAmount: number

}

const cumulativeChartConfig = {
  total: {
    label: "Cumulative Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const sponsorChartConfig = {
  NATIONAL: {
    label: "National",
    color: "hsl(var(--chart-1))",
  },
  UNIVERSITY: {
    label: "University", 
    color: "hsl(var(--chart-2))",
  },
  PRIVATE: {
    label: "Private",
    color: "hsl(var(--chart-3))",
  },
  INTERNATIONAL: {
    label: "International",
    color: "hsl(var(--chart-4))",
  },
  GOVERNMENT: {
    label: "Government",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig


const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function GrantCharts({ 
  cumulativeData, 
  sponsorData, 
  currentYear, 
  totalAmount,
  totalGrants,
  allTimeTotalAmount
}: GrantChartsProps) {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
        title={`Total Amount since 2010`}
        content= {            
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
            }).format(allTimeTotalAmount)}
          </div>}
        />  
        <StatsCard
        title={`Total Amount in ${currentYear}`}
        content= {            
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
            }).format(totalAmount)}
          </div>}
        />  
        <StatsCard
        title={`Total Grants in ${currentYear}`}
        content= {totalGrants}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cumulative Grant Amount {currentYear}</CardTitle>
            <CardDescription>
              Monthly cumulative total of approved grant amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cumulativeChartConfig}>
              <LineChart
                accessibilityLayer
                data={cumulativeData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-MY', {
                      style: 'currency',
                      currency: 'MYR',
                      notation: 'compact',
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => [
                    new Intl.NumberFormat('en-MY', {
                      style: 'currency',
                      currency: 'MYR',
                      minimumFractionDigits: 0,
                    }).format(value as number),
                    "Cumulative Amount"
                  ]}
                />
                <Line
                  dataKey="total"
                  type="monotone"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by grants received this year <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing cumulative grant amounts for {currentYear}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}