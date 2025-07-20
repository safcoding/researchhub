'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { login } from "../_actions/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus, } from "react-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
            <Image
            src="/assets/icons/mjiit.png"
            alt="Mjiit Logo"
            width={400}
            height={200}
            className="mr-4"
            />
              <span className="sr-only">MJIIT ResearcHub</span>
            </a>
            <h1 className="text-xl font-bold">Welcome back admin.</h1>
          </div>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="ali@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
              />
            </div>
        <SubmitButton/>
          </div>
        </div>
      </form>
    </div>
  )
}

function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>{pending ? "Logging in..." : "Log in"}</Button>
    )

}