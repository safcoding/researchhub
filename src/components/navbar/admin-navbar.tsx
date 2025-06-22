// src/components/admin-components/admin-navbar.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

const AdminNavbar = () => {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div>
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-3 bg-gray-100">
        <div className="flex items-center">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/8/81/UTM-LOGO.png"
            alt="UTM Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <Link href="/admin/dashboard" className="text-lg font-bold hover:text-gray-700">
            ResearchHub Admin
          </Link>
        </div>
        <div className="flex gap-8 items-center">
          <a href="https://www.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM</a>
          <a href="https://mjiit.utm.my/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">UTM MJIIT</a>
          {/* Fixed sign out button */}
          <Button 
            onClick={handleSignOut}
            variant="destructive"
            size="sm"
          >
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Navigation */}
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <nav className="flex space-x-6">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/admin/grants" className="hover:underline">Grants</Link>
            {/* Fixed broken URLs */}
            <Link href="/admin/publications" className="hover:underline">Publications</Link>
            <Link href="/admin/labs" className="hover:underline">Labs</Link>
            <Link href="/admin/announcements" className="hover:underline">Announcements</Link>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default AdminNavbar