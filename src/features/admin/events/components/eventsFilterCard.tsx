import { EventFilterForm } from "./eventssFilterForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function EventFilterCard() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filter Events</CardTitle>
            </CardHeader>
            <CardContent>
                <EventFilterForm />
            </CardContent>
        </Card>
    )
}