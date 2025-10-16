"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts"
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

const COLORS = [
  "hsl(199, 100%, 36%)",
  "hsl(248, 28%, 43%)",
  "hsl(324, 45%, 53%)",
  "hsl(1, 100%, 69%)",
  "hsl(39, 100%, 50%)",
]

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
  const sortedData = [...typeData].sort((a, b) => b.count - a.count)
  
  const dataWithColors = sortedData.map((item, index) => {
    return {
      ...item,
      color: COLORS[index % COLORS.length],
      opacity: 1 
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grants in {currentYear} by Type</CardTitle>
        <CardDescription>Number of grants by grant type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={typeChartConfig} className="h-[400px] overflow-y-auto w-full">
          <BarChart
            accessibilityLayer
            data={dataWithColors}
            layout="vertical"
            height={dataWithColors.length * 70} 
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
              radius={7}
              barSize={45} 
            >
              {dataWithColors.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  fillOpacity={entry.opacity}
                />
              ))}
              <LabelList
                dataKey="type"
                position="insideLeft"
                offset={8}
                fill="white" 
                fontSize={10}
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