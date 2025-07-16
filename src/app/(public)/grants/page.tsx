import { CumGrantCharts } from "@/features/public/grants/components/cumGrantCharts"
import { GrantTypeChart } from "@/features/public/grants/components/typeChart"
import { getGrantChartData } from "@/features/public/grants/server/chartData"
import { SponsorTypeChart } from "@/features/public/grants/components/sponsorCatchart"
import { GrantStatCards } from "@/features/public/grants/components/statCards"

export default async function PublicGrantsPage() {
  const currentYear = new Date().getFullYear()
  const chartData = await getGrantChartData(currentYear)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Research Grants Overview</h1>
        <div className="text-muted-foreground">
          View our research funding statistics and grant distribution for {currentYear}
        </div>
       </div>
      <GrantStatCards {...chartData}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GrantTypeChart {...chartData}/>
        <SponsorTypeChart {...chartData}/>
      </div>
      <CumGrantCharts {...chartData} />

    </div>
  )
}