
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, CheckSquare, Users, BookOpen, Package, MessageCircle, Bell, FileText, Settings, UserPlus } from "lucide-react"

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: Home, active: true },
  { href: "/dashboard/users/create", label: "Create User", icon: UserPlus, active: true },
  { href: "/dashboard/task", label: "Task Manager", icon: CheckSquare, active: true },
  { href: "/dashboard/hr", label: "HR Manager", icon: Users, active: true },
  { href: "/dashboard/course", label: "Course Manager", icon: BookOpen, active: true },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package, active: true },
  { href: "/dashboard/chat", label: "Chat", icon: MessageCircle, active: true },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, active: true },
  { href: "/dashboard/audit-logs", label: "Audit Logs", icon: FileText, active: true },
  { href: "/dashboard/modules", label: "Module Manager", icon: Settings, active: true, admin: true },
]

export function Sidebar() {
  const pathname = usePathname()

  const activeRoutes = routes.filter((route) => route.active)

  return (
    <aside className="w-64 glass border-r h-[calc(100vh-72px)] fixed top-[72px] left-0 p-6 space-y-2 z-40">
      <nav className="space-y-1">
        {activeRoutes.map(({ href, label, icon: Icon }) => (
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
