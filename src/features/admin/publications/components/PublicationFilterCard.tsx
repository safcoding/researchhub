import { PublicationFilterForm } from "./PublicationFilterForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function PublicationFilterCard() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filter Publication</CardTitle>
            </CardHeader>
            <CardContent>
                <PublicationFilterForm />
            </CardContent>
        </Card>
    )
}