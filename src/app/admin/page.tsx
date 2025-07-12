import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import { getEnvironmentData } from "worker_threads"

async function getGrantData(){
  const data = await db.grant.aggregate({
    _sum: { approved_amount: true},
    _count: true
  })
  return {
    amount: data._sum.approved_amount ||  0,
    numberOfGrants:  data._count
  }
}

async function getPublicationData(){
  const data = await db.publication.aggregate({
    _count: true
  })
  return {
    numberOfPublication:  data._count
  }
}

async function getLabData(){
  const data = await db.lab.aggregate({
    _count: true
  })
  return {
    numberOfLabs:  data._count
  }
}

async function getEquipmentData(){
  const data = await db.equipment.aggregate({
    _count: true
  })
  return {
    numberOfEquipment:  data._count
  }
}

async function getEventData(){
  const data = await db.event.aggregate({
    _count: true
  })
  return {
    numberOfEvents:  data._count
  }
}

export default async function Page() {
  const grantData = await getGrantData()
  const publicationData = await getPublicationData()
  const labData = await getLabData()
  const equipmentData = await getEquipmentData()
  const eventData = await getEventData()

  return (
    <>
      <DashboardCard title="Grants Overview" subtitle={`${formatNumber(grantData.numberOfGrants)} Total Grants`} body= {`Total Amount: ${formatCurrency(grantData.amount)}`}/>
      <DashboardCard title="Publications Overview" subtitle={`${formatNumber(publicationData.numberOfPublication)} Total Publications`} body= ""/>
      <DashboardCard title="Labs & Equipment Overview" subtitle={`${formatNumber(labData.numberOfLabs)} Labs in MJIIT`} body= {`${formatNumber(equipmentData.numberOfEquipment)} Total Equipment`}/>
      <DashboardCard title="Events Overview" subtitle={`${formatNumber(eventData.numberOfEvents)} Total Events`} body= ""/>
    </>
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