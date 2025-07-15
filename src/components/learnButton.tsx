"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

export function LearnMoreButton () {
    const router = useRouter()

    return (
        <Button variant="outline" className="group" onClick={() => router.push("/about")}>
        Learn more
        <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5">
        </ExternalLink>
        </Button>       
    )
}