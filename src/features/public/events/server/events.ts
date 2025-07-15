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