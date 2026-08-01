import { NavLink } from "react-router";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { NAV_ITEMS } from "@/config/navigation.config";
import { filterByRole } from "@/utils/rbac.helpers";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed: boolean;
};

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const [hovered, setHovered] = useState(false);
  const userRole = useAppSelector((state) => state.auth.user?.type);
  const navItems = filterByRole(NAV_ITEMS, userRole);
  const expanded = !collapsed || hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300",
        expanded ? "w-56" : "w-16",
      )}
    >
      <div
        className={cn(
          "flex items-center py-6",
          expanded ? "gap-2.5 px-5" : "justify-center px-2",
        )}
      >
        <img
          src="/logo.png"
          alt="ABC-School logo"
          className="size-9 shrink-0 rounded-lg object-cover"
        />
        {expanded && (
          <span className="truncate text-lg font-bold tracking-wide text-sidebar-foreground">
            ABC-School
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
                  expanded ? "px-3" : "justify-center px-0",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {expanded && <span className="flex-1">{item.label}</span>}
              {expanded && (
                <ChevronRightIcon className="size-3.5 opacity-40 transition-opacity group-hover:opacity-70" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
