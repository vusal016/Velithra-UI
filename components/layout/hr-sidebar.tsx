"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Briefcase, Building2 } from "lucide-react"

const hrRoutes = [
  { href: "/hr/employees", label: "Employees", icon: Users },
  { href: "/hr/departments", label: "Departments", icon: Building2 },
  { href: "/hr/positions", label: "Positions", icon: Briefcase },
]

export function HRSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 glass border-r h-[calc(100vh-72px)] fixed top-[72px] left-0 p-6 space-y-2 z-40">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#00d9ff] mb-1">HR Management</h2>
        <p className="text-xs text-[#6b8ca8]">Human Resources Portal</p>
      </div>
      
      <nav className="space-y-1">
        {hrRoutes.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
              pathname.startsWith(href)
                ? "bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/40 shadow-sm shadow-[#00d9ff]/20"
                : "text-[#6b8ca8] hover:text-[#e8f4f8] hover:bg-white/5",
            )}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
