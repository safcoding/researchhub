import { LoginForm } from "@/app/login/_components/login-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <Button 
            variant="ghost" 
            className="flex items-center gap-2"
        >
            <ArrowLeft className="h-4 w-4" />
          <Link href="/" />
            Back
        </Button>
      </div>
    </div>
  )
}
