'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { User } from '@supabase/supabase-js'

interface ConditionalNavbarProps {
  children?: React.ReactNode;
}

const ConditionalNavbar = ({ children }: ConditionalNavbarProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Get current user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Show loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200"></div>
        </div>
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // If user is logged in, show admin sidebar
  if (user) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-gray-800">Admin Panel</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // If not logged in, just return children without sidebar
  return <>{children}</>
}

export default ConditionalNavbar