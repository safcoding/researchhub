"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig } from "@/components/ui/chart"

interface GrantChartProps{
  typeData: Array<{
    type: string
    count: number
  }>
}

const typeChartConfig = {
  count: {
    label: "Number of Grants",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function GrantTypeChart({
    typeData,
}: GrantChartProps) {
    return(
       <Card>
          <CardHeader>
            <CardTitle>Grants by Type</CardTitle>
            <CardDescription>Number of grants by grant type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={typeChartConfig}>
              <BarChart
                accessibilityLayer
                data={typeData}
                layout="horizontal"
                margin={{
                  left: 100,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={80}
                  fontSize={12}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value, name) => [
                    `${value} grants`,
                    "Count"
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-2))" // Change from var(--color-count) to hsl(var(--chart-2))
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    )
}