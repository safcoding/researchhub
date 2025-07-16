import db from "@/db/db"

export async function getPublicationChartData(year: number = new Date().getFullYear()) {
  const publications = await db.publication.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    select: {
      date: true,
      category: true,
      type: true,
    },
    orderBy: {
      date: 'asc'
    }
  })

  const monthlyData = new Map<string, number>()
  let cumulativeTotal = 0
  for (let month = 1; month <= 12; month++) {
    const monthKey = new Date(year, month - 1).toLocaleString('default', { month: 'short' })
    monthlyData.set(monthKey, 0)
  }
  publications.forEach(pub => {
    if (pub.date) {
      const month = pub.date.toLocaleString('default', { month: 'short' })
      cumulativeTotal += 1
      monthlyData.set(month, cumulativeTotal)
    }
  })
  let lastValue = 0
  const cumulativeData = Array.from(monthlyData.entries()).map(([month, total]) => {
    if (total === 0) {
      return { month, total: lastValue }
    }
    lastValue = total
    return { month, total }
  })


  const categoryMap = new Map<string, number>()
  publications.forEach(pub => {
    if (pub.category) {
      categoryMap.set(pub.category, (categoryMap.get(pub.category) || 0) + 1)
    }
  })
  const categoryData = Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))


  const typeMap = new Map<string, number>()
  publications.forEach(pub => {
    if (pub.type) {
      typeMap.set(pub.type, (typeMap.get(pub.type) || 0) + 1)
    }
  })

  const typeData = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count)
  const allTimeTotal = await db.publication.count()

  return {
    cumulativeData,
    categoryData,
    typeData,
    currentYear: year,
    totalPublications: publications.length,
    allTimeTotal
  }
}