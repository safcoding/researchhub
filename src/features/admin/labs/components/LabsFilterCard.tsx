import { LabFilterForm } from "./LabsFilterForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LabFilterCard() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filter Labs</CardTitle>
            </CardHeader>
            <CardContent>
                <LabFilterForm />
            </CardContent>
        </Card>
    )
}