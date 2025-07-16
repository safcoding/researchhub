"use server"

import db from "@/db/db"

export async function getLatestEvents(limit: number = 3) {
    try {
        const events = await db.event.findMany({
            where: {
                status: "Upcoming"
            },
            select: {
                event_id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                location: true,
                image: true,
                category: true,
                organizer: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })
        
        return events
    } catch (error) {
        console.error('Error fetching latest events:', error)
        return []
    }
}

export async function getEvents(
  page: number = 1,
  pageSize: number = 9,
  query?: string,
  category?: string
) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (query) {
    where.OR = [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
      {
        description: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ]
  }

  if (category && category !== 'all') {
    where.category = {
      equals: category,
      mode: 'insensitive' as const,
    }
  }

  const totalCount = await db.event.count({ where })
  
  const events = await db.event.findMany({
    where,
    select: {
      event_id: true,
      title: true,
      description: true,
      date: true,
      time: true,
      location: true,
      image: true,
      category: true,
      organizer: true
    },
    orderBy: { date: 'asc' },
    skip,
    take: pageSize,
  })

  return { data: events, totalCount }
}

export async function getEventById(event_id: string) {
  try {
    const event = await db.event.findUnique({
      where: { event_id: event_id },
    })
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}