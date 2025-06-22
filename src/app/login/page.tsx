// src/app/admin/login/page.tsx
import { login } from './actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show error message if present */}
          {searchParams.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {decodeURIComponent(searchParams.error)}
            </div>
          )}
          
          {/* ✅ Add action directly to form */}
          <form action={login}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="safuan@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password"
                  name="password"
                  required 
                />
              </div>
            </div>
      <Button formAction={login}>Log in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}