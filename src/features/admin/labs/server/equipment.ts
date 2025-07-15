"use server"

import db from "@/db/db"

export async function searchEquipment(query: string, excludeIds: string[] = []) {
    if (!query || query.length < 2) {
        return []
    }

    try {
        const equipment = await db.equipment.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        equipment_id: {
                            notIn: excludeIds
                        }
                    }
                ]
            },
            select: {
                equipment_id: true,
                name: true
            },
            take: 20,
            orderBy: {
                name: 'asc'
            }
        })

        return equipment
    } catch (error) {
        console.error('Equipment search error:', error)
        return []
    }
}

export async function getEquipmentById(equipmentId: string) {
    try {
        const equipment = await db.equipment.findUnique({
            where: { equipment_id: equipmentId },
            select: {
                equipment_id: true,
                name: true
            }
        })
        return equipment
    } catch (error) {
        console.error('Error fetching equipment:', error)
        return null
    }
}