/**
 * Velithra - Dynamic Sidebar Component
 * Professional sidebar with clean navigation
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/providers/auth-provider";
import { MODULES } from "@/lib/config/modules";
import { useModuleStore } from "@/lib/store/moduleStore";
import { moduleService } from "@/lib/services/moduleService";

export function DynamicSidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { activeModuleCodes, setModules, shouldRefetch } = useModuleStore();

  // Fetch active modules from backend on mount
  useEffect(() => {
    if (user && shouldRefetch()) {
      fetchActiveModules();
    }
  }, [user]);

  const fetchActiveModules = async () => {
    try {
      const activeModules = await moduleService.getActive();
      
      // Map backend modules to store format
      const mappedModules = activeModules.map((m) => ({
        code: m.code,
        name: m.name,
        path: MODULES[m.code]?.path || '/dashboard',
        icon: MODULES[m.code]?.icon?.name || 'Square',
        roles: MODULES[m.code]?.roles || ['Admin'],
        isActive: m.isActive,
        order: MODULES[m.code]?.order || 999,
      }));
      
      setModules(mappedModules);
    } catch (error) {
      console.error('[Dynamic Sidebar] Failed to fetch modules:', error);
    }
  };

  // Get all visible modules based on user roles AND active status from backend
  const visibleModules = useMemo(() => {
    if (!user?.roles || user.roles.length === 0) return [];
    
    return Object.values(MODULES)
      .filter((module) => {
        const hasRole = module.roles.some((role) => user.roles.includes(role));
        const isActive = activeModuleCodes.includes(module.code);
        return hasRole && isActive;
      })
      .sort((a, b) => a.order - b.order);
  }, [user, activeModuleCodes]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      <aside className="w-64 bg-[#0a1628] border-r border-white/10 h-[calc(100vh-72px)] fixed top-[72px] left-0 z-10 overflow-y-auto">
        <nav className="p-3 space-y-1">
          {visibleModules.map((module) => {
            const Icon = module.icon;
            const active = isActive(module.path);

            return (
              <Link
                key={module.code}
                href={module.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={20} className="shrink-0" />
                <span>{module.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content wrapper with margin */}
    </>
  );
}
