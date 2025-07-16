"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

interface GrantChartProps {
  typeData: Array<{
    type: string
    count: number
  }>
  currentYear: number
}

const typeChartConfig = {
  count: {
    label: "Grant Count",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function GrantTypeChart({ typeData, currentYear }: GrantChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grants in {currentYear} by Type</CardTitle>
        <CardDescription>Number of grants by grant type</CardDescription>
      </CardHeader>
      <CardContent>
<ChartContainer config={typeChartConfig} className="h-[400px] overflow-y-auto">
  <BarChart
    accessibilityLayer
    data={typeData}
    layout="vertical"
    height={typeData.length * 70} 
    margin={{
      right: 20,
      left: 15,
    }}
  >
    <CartesianGrid horizontal={false} />
    <YAxis
      dataKey="type"
      type="category"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 15)}
      hide
    />
    <XAxis dataKey="count" type="number" hide />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="line" />}
    />
    <Bar
      dataKey="count"
      layout="vertical"
      fill="var(--color-count)"
      radius={4}
      barSize={45} 
    >
      <LabelList
        dataKey="type"
        position="insideLeft"
        offset={8}
        fill="--color-label"
        fontSize={11}
        formatter={(value: string) => value ? String(value).slice(0, 20) + (String(value).length > 20 ? '...' : '') : ''}
      />
      <LabelList
        dataKey="count"
        position="right"
        offset={8}
        className="fill-foreground"
        fontSize={12}
      />
    </Bar>
  </BarChart>
</ChartContainer>
      </CardContent>
    </Card>
  )
}