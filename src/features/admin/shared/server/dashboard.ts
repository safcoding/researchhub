import db from "@/db/db"

export async function getDashboardData() {
  const [grantsCount, publicationsCount, eventsCount, labsCount, partnersCount] = await Promise.all([
    db.grant.count(),
    db.publication.count(),
    db.event.count(),
    db.lab.count(),
    db.partner.count(),
  ])

  const recentGrants = await db.grant.findMany({
    select: { project_title: true, type: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const recentEvents = await db.event.findMany({
    select: { title: true, date: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const partners = await db.partner.findMany({
    select: { partner_id: true, name: true, image: true },
    orderBy: { name: 'asc' },
  })

  return {
    counts: { grantsCount, publicationsCount, eventsCount, labsCount, partnersCount },
    recent: { grants: recentGrants, events: recentEvents },
    partners
  }
}