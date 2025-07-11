import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <DashboardCard title="Grants" subtitle="sub to me" body= "body shiii"/>
  )
}

type DashboardCardProps =  {
  title: String
  subtitle: String
  body: String
}

function DashboardCard({ title, subtitle, body}: DashboardCardProps) {
  return(
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent> {body}</CardContent>
    </Card>
  )
}