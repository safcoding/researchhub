import { LoginForm } from "@/components/login-form"
import Footer from '@/components/footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}