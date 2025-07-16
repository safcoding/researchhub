"use server"

import db from "@/db/db"

export async function exportGrantsToExcel(
  query?: string,
  type?: string,
  status?: string,
  sponsor_category?: string,
  date_from?: string,
  date_to?: string,
) {
  const where: any = {}


  if (query) {
    where.OR = [
      {
        project_title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ]
  }

  if (type && type !== 'any') {
    if (type === 'Others') {
      where.type = {
        notIn: [
          'UNIVERSITY GRANT',
          'GOVERNMENT GRANT', 
          'INDUSTRIAL GRANT',
          'RESEARCH CONTRACT'
        ]
      }
    } else {
      where.type = {
        equals: type,
        mode: 'insensitive' as const,
      }
    }
  }

  if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }

  if (sponsor_category && sponsor_category !== 'any') {
    where.sponsor_category = {
      equals: sponsor_category,
      mode: 'insensitive' as const,
    }
  }

  if (date_from || date_to) {
    where.pro_date_start = {}
    
    if (date_from) {
      where.pro_date_start.gte = new Date(date_from)
    }
    
    if (date_to) {
      where.pro_date_start.lte = new Date(date_to)
    }
  }

  const grants = await db.grant.findMany({
    where,
    select: {
      project_id: true, 
      project_title: true, 
      approved_amount: true, 
      type: true, 
      sponsor_category: true, 
      sponsor_name: true, 
      subsponsor_name: true, 
      status: true, 
      pro_date_start: true  
    },
    orderBy: { createdAt: 'desc' },
  })

  const excelData = grants.map((grant, index) => ({
    'No.': index + 1,
    'Project ID': grant.project_id,
    'Project Title': grant.project_title,
    'Approved Amount (MYR)': grant.approved_amount,
    'Type': grant.type,
    'Sponsor Category': grant.sponsor_category,
    'Sponsor Name': grant.sponsor_name,
    'Sub-sponsor Name': grant.subsponsor_name || '',
    'Status': grant.status,
    'Start Date': grant.pro_date_start ? new Date(grant.pro_date_start).toLocaleDateString() : '',
  }))

  return {
    data: excelData,
    totalCount: grants.length,
    filename: `grants_export_${new Date().toISOString().split('T')[0]}.xlsx`
  }
}