import { getPartners } from "@/features/public/partners/server/partners"
import { PartnerGrid } from "@/features/public/partners/components/partnerGrid"

export default async function PartnersPage() {

  const { data: partners } = await getPartners()
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">All of our industry Partners</h1>
      </div>
          <PartnerGrid
            partners={partners}
          />
    </div>
  )
}