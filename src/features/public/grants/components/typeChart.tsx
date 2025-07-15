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
  ChartTooltipContent
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
            <ChartContainer config={typeChartConfig} className="h-[300px]">
              <BarChart
                accessibilityLayer
                data={typeData}
                layout="horizontal"
                margin={{
                  left: 80,
                  right: 20,
                  top: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={70}
                />
                <XAxis 
                  dataKey="count" 
                  type="number"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-2))"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    )
}