import { GrantFilterForm } from "@/features/admin/grants/components/grantFilterForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function GrantFilterCard() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filter Grants</CardTitle>
            </CardHeader>
            <CardContent>
                <GrantFilterForm />
            </CardContent>
        </Card>
    )
}