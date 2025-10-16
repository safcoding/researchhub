"use client"

import {  Pie, PieChart, Cell } from "recharts"
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

export function SponsorTypeChart({
    sponsorData,
    currentYear
}: GrantChartProps) {
    const sortedData = [...sponsorData].sort((a, b) => b.amount - a.amount)
    const dynamicConfig = generateCategoryConfig(sortedData)
    const dataWithColors = sortedData.map((item, index) => {
      return {
        ...item,
        color: COLORS[index % COLORS.length],
        opacity: 1 
      }
    })

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
                data={dataWithColors} 
                dataKey="amount"
                nameKey="category"
                innerRadius={40}
                strokeWidth={5}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
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