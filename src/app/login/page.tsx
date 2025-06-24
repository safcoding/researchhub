import { LoginForm } from "@/components/login-form"
// Fixed import path to match the actual file name (Footer.tsx with capital F)
import Footer from '@/components/Footer';
import Navbar from '@/components/navbar';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="bg-background flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}