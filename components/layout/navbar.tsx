"use client"

import Link from "next/link"
import { VelithraLogo } from "@/components/logo/velithra-logo"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface NavbarProps {
  user?: { email: string; role: string } | null
  onLogout?: () => void
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="glass border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <VelithraLogo size={60} animate={false} />
          <span className="text-lg font-bold text-[#00d9ff] hidden sm:inline">Velithra</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted hidden sm:block">
              <div className="font-medium text-foreground">{user.email}</div>
              <div className="text-xs capitalize">{user.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
