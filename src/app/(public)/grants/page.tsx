import { GrantCharts } from "@/features/public/grants/server/components/grantCharts"
import { GrantTypeChart } from "@/features/public/grants/server/components/typeChart"
import { getGrantChartData } from "@/features/public/grants/server/chartData"
import { SponsorTypeChart } from "@/features/public/grants/server/components/sponsorCatchart"

export default async function PublicGrantsPage() {
  const currentYear = new Date().getFullYear()
  const chartData = await getGrantChartData(currentYear)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Research Grants Overview</h1>
        <p className="text-muted-foreground">
          View our research funding statistics and grant distribution for {currentYear}
        </p>
      </div>
      <GrantCharts {...chartData} />
      <GrantTypeChart {...chartData}/>
      <SponsorTypeChart {...chartData}/>
    </div>
  )
}