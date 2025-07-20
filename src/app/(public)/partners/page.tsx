import { getPartners } from "@/features/public/partners/server/partners"
import { PartnerGrid } from "@/features/public/partners/components/partnerGrid"

export default async function PartnersPage() {

  const { data: partners } = await getPartners()
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-center space-y-4 mb-4 mt-10">
        <h1 className="text-4xl font-bold">All of our industry Partners</h1>
      </div>
        <div className="px-20 py-8 justify-center">
          <PartnerGrid
            partners={partners}
          />
        </div>

    </div>
  )
}