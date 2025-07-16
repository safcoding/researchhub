"use client"

import { CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface GrantChartsProps {
  cumulativeData: Array<{
    month: string
    total: number
  }>
  currentYear: number
  totalAmount: number
}

const cumulativeChartConfig = {
  total: {
    label: "Cumulative Amount",
    color:   "hsl(176, 86%, 28%)",
  },
} satisfies ChartConfig

export function CumGrantCharts({ 
  cumulativeData, 
  currentYear, 
}: GrantChartsProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cumulative Grant Amount {currentYear}</CardTitle>
            <CardDescription>
              Monthly cumulative total of approved grant amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cumulativeChartConfig} className="h-[400px] w-[1500px]">
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
                  height={100}
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
        </Card>
      </div>
  )
}