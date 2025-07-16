"use client"

import { Pie, PieChart, Cell } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"


interface PublicationTypeChartProps {
  typeData: Array<{
    type: string
    count: number
  }>
}

const generateTypeConfig = (typeData: Array<{type: string, count: number}>) => {
  const config: ChartConfig = {}
  typeData.forEach((item, index) => {
    config[item.type] = {
      label: item.type,
      color: COLORS[index % COLORS.length], 
    }
  })
  return config
}

const COLORS = [
  "hsl(176, 86%, 28%)",
  "hsl(175, 34%, 79%)",
  "hsl(175, 34%, 64%)",
  "hsl(176, 46%, 43%)",
  "hsl(175, 34%, 86%)",
]

export function PublicationTypeChart({ typeData }: PublicationTypeChartProps) {
    const sortedData = [...typeData].sort((a, b) => b.count - a.count)
    const dynamicConfig = generateTypeConfig(sortedData)
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
        <CardTitle>Publications by Type</CardTitle>
        <CardDescription>Distribution of publications by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => [
                    `${value} `,
                    name
                  ]}
                />
              }
            />
            <Pie
              data={dataWithColors}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={2}
            >
              {dataWithColors.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="flex-wrap gap-2 justify-center text-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}