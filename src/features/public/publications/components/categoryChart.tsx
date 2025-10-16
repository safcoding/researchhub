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

interface PublicationCategoryChartProps {
  categoryData: Array<{
    category: string
    count: number
  }>
}

const generateCategoryConfig = (categoryData: Array<{category: string, count: number}>) => {
  const config: ChartConfig = {}
  categoryData.forEach((item, index) => {
    config[item.category] = {
      label: item.category,
      color: COLORS[index % COLORS.length], 
    }
  })
  return config
}


const COLORS = [
  "hsl(199, 100%, 36%)",
  "hsl(248, 28%, 43%)",
  "hsl(324, 45%, 53%)",
  "hsl(1, 100%, 69%)",
  "hsl(39, 100%, 50%)",
]


export function PublicationCategoryChart({ categoryData }: PublicationCategoryChartProps) {
    const sortedData = [...categoryData].sort((a, b) => b.count - a.count)
    const dynamicConfig = generateCategoryConfig(sortedData)
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
        <CardTitle>Publications by Category</CardTitle>
        <CardDescription>Distribution of publications by category</CardDescription>
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
              nameKey="category"
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
              content={<ChartLegendContent nameKey="category" />}
              className="flex-wrap gap-2 justify-center text-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}