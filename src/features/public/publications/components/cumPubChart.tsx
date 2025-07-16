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

interface PublicationChartsProps {
  cumulativeData: Array<{
    month: string
    total: number
  }>
  currentYear: number
  totalGrants: number
  allTimeTotalAmount: number

}

const cumulativeChartConfig = {
  total: {
    label: "Cumulative Publications",
    color: "hsl(176, 86%, 28%)",
  },
} satisfies ChartConfig

export function CumPubCharts({ 
  cumulativeData, 
  currentYear, 
}: PublicationChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cumulative Publications {currentYear}</CardTitle>
          <CardDescription>
            Monthly cumulative total of publications
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
                  new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    maximumFractionDigits: 0,
                  }).format(value)
                }
                height={100}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value) => [
                  new Intl.NumberFormat('en-US', {
                    maximumFractionDigits: 0,
                  }).format(value as number),
                  " Publications"
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