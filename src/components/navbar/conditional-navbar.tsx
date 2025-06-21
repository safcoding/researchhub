// src/components/conditional-navbar.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '@/components/navbar/navbar'
import AdminNavbar from '@/components/navbar/admin-navbar'
import type { User } from '@supabase/supabase-js'

const ConditionalNavbar = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
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
  }, [supabase])

  if (loading) {
    // Show skeleton navbar while loading
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200"></div>
        <div className="h-16 bg-blue-200"></div>
      </div>
    )
  }

  // Show admin navbar if user is logged in, otherwise show public navbar
  return user ? <AdminNavbar /> : <Navbar />
}

export default ConditionalNavbar