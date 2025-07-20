"use server"
import db from "@/db/db"

export async function getPartners() {

  const totalCount = await db.partner.count()
  
  const partners = await db.partner.findMany({
    select: {
      partner_id: true,
      name: true,
      image: true,
    },
    orderBy: { created_at: 'asc' },
  })

  return { data: partners, totalCount }
}