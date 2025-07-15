import db from "@/db/db"

export async function getGrantChartData(year: number = new Date().getFullYear()) {

  const grants = await db.grant.findMany({
    where: {
      pro_date_start: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    select: {
      pro_date_start: true,
      approved_amount: true,
      sponsor_category: true,
      type: true,
    },
    orderBy: {
      pro_date_start: 'asc'
    }
  })

  const allTimeTotal = await db.grant.aggregate({
    _sum: {
      approved_amount: true
    }
  })

  const monthlyData = new Map<string, number>()
  let cumulativeTotal = 0
  
  for (let month = 1; month <= 12; month++) {
    const monthKey = new Date(year, month - 1).toLocaleString('default', { month: 'short' })
    monthlyData.set(monthKey, 0)
  }

  grants.forEach(grant => {
    if (grant.pro_date_start && grant.approved_amount) {
      const month = grant.pro_date_start.toLocaleString('default', { month: 'short' })
      cumulativeTotal += grant.approved_amount
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

  const sponsorMap = new Map<string, { amount: number, count: number }>()
  
  grants.forEach(grant => {
    if (grant.sponsor_category && grant.approved_amount) {
      const existing = sponsorMap.get(grant.sponsor_category) || { amount: 0, count: 0 }
      sponsorMap.set(grant.sponsor_category, {
        amount: existing.amount + grant.approved_amount,
        count: existing.count + 1
      })
    }
  })

  const sponsorData = Array.from(sponsorMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count
  }))

  const typeMap = new Map<string, number>()
  
  grants.forEach(grant => {
    if (grant.type) {
      let typeKey = grant.type
      const mainTypes = ['UNIVERSITY GRANT', 'GOVERNMENT GRANT', 'INDUSTRIAL GRANT', 'RESEARCH CONTRACT']
      if (!mainTypes.includes(grant.type)) {
        typeKey = 'Others'
      }
      typeMap.set(typeKey, (typeMap.get(typeKey) || 0) + 1)
    }
  })

  const typeData = Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count) 

  const totalAmount = grants.reduce((sum, grant) => sum + (grant.approved_amount || 0), 0)
  const totalGrants = grants.length
  const allTimeTotalAmount = allTimeTotal._sum.approved_amount || 0


  return {
    cumulativeData,
    sponsorData,
    typeData,
    currentYear: year,
    totalAmount,
    totalGrants,
    allTimeTotalAmount
  }
}