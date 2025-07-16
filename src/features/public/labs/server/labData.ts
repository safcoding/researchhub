"use server"

import db from "@/db/db"

export async function getPublicLabs(
  page: number = 1,
  pageSize: number = 9,
  type?: string,
  query?: string,
  equipment_query?: string
) {
  const skip = (page - 1) * pageSize
  const where: any = {}
  const searchConditions = []


  if (query) {
    searchConditions.push({
      lab_name: {
        contains: query,
        mode: 'insensitive' as const,
      },
    })
  }
  
  if (equipment_query) {
    searchConditions.push({
      lab_equipment: {
        some: {
          equipment: {
            name: {
              contains: equipment_query,
              mode: 'insensitive' as const,
            }
          }
        }
      }
    })
  }

  if (searchConditions.length > 0) {
    where.OR = searchConditions
  }


  if (type && type !== 'all') {
    where.type = {
      equals: type,
      mode: 'insensitive' as const,
    }
  }

  const totalCount = await db.lab.count({ where })
  
  const labs = await db.lab.findMany({
    where,
    include: {
      lab_equipment: {
        include: {
          equipment: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  })

  return { data: labs, totalCount }
}

export async function getLabById(labId: string) {
  try {
    const lab = await db.lab.findUnique({
      where: { lab_id: labId },
      include: {
        lab_equipment: {
          include: {
            equipment: true
          }
        }
      }
    })
    return lab
  } catch (error) {
    console.error('Error fetching lab:', error)
    return null
  }
}