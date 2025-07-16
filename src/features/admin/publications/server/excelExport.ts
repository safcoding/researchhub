"use server"

import db from "@/db/db"

export async function exportPublicationsToExcel(
  query?: string,
  type?: string,
  status?: string,
  category?: string,
  date_from?: string,
  date_to?: string,
) {
  const where: any = {}

  if (query) {
    where.OR = [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const,
        },
      },
    ]
  }

  if (status && status !== 'any') {
    where.status = {
      equals: status,
      mode: 'insensitive' as const,
    }
  }

  if (category && category !== 'any') {
    where.category = {
      equals: category,
      mode: 'insensitive' as const,
    }
  }

  if (type && type !== 'any') {
    where.type = {
      equals: type,
      mode: 'insensitive' as const,
    }
  }

  if (date_from || date_to) {
    where.date = {}
    
    if (date_from) {
      where.date.gte = new Date(date_from)
    }
    
    if (date_to) {
      where.date.lte = new Date(date_to)
    }
  }

  const publications = await db.publication.findMany({
    where,
    select: {
    pub_refno               : true,
    status                  : true,      
    type                    : true,        
    category                : true,  
    journal                 : true, 
    title                   : true,
    impact                  : true,     
    date                    : true,     
    level                   : true,    
    author_id               : true,  
    research_alliance       : true,
    rg_name                 : true,
    author_name             : true,
    publication_id          : true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const excelData = publications.map((pub, index) => ({
    'No.': index + 1,
    'Publication ID': pub.publication_id,
    'Reference No.': pub.pub_refno,
    'Title': pub.title,
    'Journal': pub.journal,
    'Impact': pub.impact,
    'Type': pub.type,
    'Category': pub.category,
    'Level': pub.level,
    'Status': pub.status,
    'Publication Date': pub.date ? new Date(pub.date).toLocaleDateString() : '',
    'Author Name': pub.author_name,
    'Author ID': pub.author_id,
    'Research Alliance': pub.research_alliance,
    'Research Group Name': pub.rg_name,
  }))

  return {
    data: excelData,
    totalCount: publications.length,
    filename: `publications_export_${new Date().toISOString().split('T')[0]}.xlsx`
  }
}