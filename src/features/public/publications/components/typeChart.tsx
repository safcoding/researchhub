"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
} from "@/components/ui/chart"

interface PublicationTypeChartProps {
  typeData: Array<{
    type: string
    count: number
  }>
}

const typeChartConfig = {
  count: {
    label: "Publication Count",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function PublicationTypeChart({ typeData }: PublicationTypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publications by Type</CardTitle>
        <CardDescription>Distribution of publications by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer 
        config={typeChartConfig} 
        className="h-[300px] overflow-y-auto w-full"
        >
        <BarChart
            accessibilityLayer
            data={typeData}
            layout="vertical"
            height={typeData.length * 70} 
            margin={{
            right: 20,
            left: 15,
            top: 10,
            bottom: 10,
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
            fill="hsl(var(--chart-2))"
            radius={4}
            barSize={40} // Slightly larger bars
            >
              <LabelList
                dataKey="type"
                position="insideLeft"
                offset={8}
                fill="--color-label"
                fontSize={12}
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