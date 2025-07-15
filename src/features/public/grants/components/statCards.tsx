"use client"

import StatsCard from "@/components/statsCard"

interface GrantChartsProps {
    currentYear: number
  totalAmount: number
  totalGrants: number
  allTimeTotalAmount: number
}

export function GrantStatCards({ 
  currentYear, 
  totalAmount,
  totalGrants,
  allTimeTotalAmount
}: GrantChartsProps) {
  return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
        title={`Total Amount since 2010`}
        content= {            
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
            }).format(allTimeTotalAmount)}
          </div>}
        />  
        <StatsCard
        title={`Total Amount in ${currentYear}`}
        content= {            
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
            }).format(totalAmount)}
          </div>}
        />  
        <StatsCard
        title={`Total Grants in ${currentYear}`}
        content= {totalGrants}
        />
      </div>
  )
}