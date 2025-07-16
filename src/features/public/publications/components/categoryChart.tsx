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
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    }
  })
  return config
}


const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]


export function PublicationCategoryChart({ categoryData }: PublicationCategoryChartProps) {
  const dynamicConfig = generateCategoryConfig(categoryData)
  
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
              data={categoryData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={2}
            >
              {categoryData.map((entry, index) => (
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