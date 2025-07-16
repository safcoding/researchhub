import { CumPubCharts } from "@/features/public/publications/components/cumPubChart"
import { PublicationTypeChart } from "@/features/public/publications/components/typeChart"
import { getPublicationChartData } from "@/features/public/publications/server/chartData"
import { PublicationCategoryChart } from "@/features/public/publications/components/categoryChart"
import { PublicationStatCards } from "@/features/public/publications/components/statCards"

export default async function PublicPublicationPage() {
  const currentYear = new Date().getFullYear()
  const chartData = await getPublicationChartData(currentYear)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Research Publication Overview</h1>
        <div className="text-muted-foreground">
          View our publications for {currentYear}
        </div>
       </div>
      <PublicationStatCards {...chartData}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PublicationTypeChart {...chartData}/>
        <PublicationCategoryChart {...chartData}/>
      </div>
      <CumPubCharts {...chartData} />
    </div>
  )
}