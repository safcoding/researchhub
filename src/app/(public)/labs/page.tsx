import { getPublicLabs } from "@/features/public/labs/server/labData"
import { LabsGrid } from "@/features/public/labs/components/labGrid"
import { LabsSearch } from "@/features/public/labs/components/searchBars"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

const LAB_TYPES = [
  { value: 'all', label: 'All Labs' },
  { value: 'i-Kohza', label: 'i-Kohza' },
  { value: 'Research Lab', label: 'Research Lab' },
  { value: 'Satellite Lab', label: 'Satellite Lab' },
  { value: 'Teaching Lab', label: 'Teaching Lab' },
  { value: 'Service Lab', label: 'Service Lab' },
]

export default async function PublicLabsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    type?: string
    query?: string
    equipment_query?: string
  }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 9
  const type = params.type || 'all'
  const query = params.query || ''
  const equipment_query = params.equipment_query || ''

  const { data: labs, totalCount } = await getPublicLabs(
    page, 
    pageSize, 
    type, 
    query, 
    equipment_query
  )

  const hasActiveSearch = query.trim() || equipment_query.trim()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Research Labs & Facilities
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our state-of-the-art laboratories and research facilities at MJIIT
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <LabsSearch />
      </div>
``
      <div className="flex flex-wrap gap-2 justify-center">
        {LAB_TYPES.map((labType) => (
          <Button
            key={labType.value}
            variant={type === labType.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link
              href={`/labs?type=${labType.value}&page=1${query ? `&query=${encodeURIComponent(query)}` : ''}${equipment_query ? `&equipment_query=${encodeURIComponent(equipment_query)}` : ''}`}
              className="no-underline"
            >
              {labType.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          {totalCount > 0 ? (
            <>
              Found <span className="font-semibold">{totalCount}</span> {type === 'all' ? 'labs' : type.toLowerCase() + 's'}
              {hasActiveSearch && (
                <span className="text-sm ml-2">
                  matching your search criteria
                </span>
              )}
            </>
          ) : (
            <>
              No {type === 'all' ? 'labs' : type.toLowerCase() + 's'} found
              {hasActiveSearch && (
                <span className="text-sm ml-2">
                  matching your search criteria
                </span>
              )}
            </>
          )}
        </p>
      </div>

      <Suspense fallback={<div className="text-center">Loading labs...</div>}>
        <LabsGrid 
          labs={labs}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </Suspense>
    </div>
  )
}