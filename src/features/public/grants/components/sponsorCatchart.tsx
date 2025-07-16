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

interface GrantChartProps {
  sponsorData: Array<{
    category: string
    amount: number
    count: number
  }>
  currentYear: number
}

const generateCategoryConfig = (sponsorData: Array<{category: string, count: number}>) => {
  const config: ChartConfig = {}
  sponsorData.forEach((item, index) => {
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

export function SponsorTypeChart({
    sponsorData,
    currentYear
}: GrantChartProps) {
    const dynamicConfig = generateCategoryConfig(sponsorData)

      return(
        <Card>
          <CardHeader>
            <CardTitle>Grants in {currentYear} by Sponsor Category</CardTitle>
            <CardDescription>Distribution of grant amounts by sponsor type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={dynamicConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent 
                      hideLabel 
                      formatter={(value, name) => [
                        `${new Intl.NumberFormat('en-MY', {
                          style: 'currency',
                          currency: 'MYR',
                          minimumFractionDigits: 0,
                        }).format(value as number)} (${
                          sponsorData.find(item => item.category === name)?.count || 0
                        } grants)`,
                        name
                      ]}
                    />
                  }
                />
                <Pie
                  data={sponsorData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={40}
                  strokeWidth={5}
                >
                  {sponsorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="category" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )
}