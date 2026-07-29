import { NavLink } from "react-router";
import { ChevronRightIcon } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { NAV_ITEMS } from "@/config/navigation.config";
import { filterByRole } from "@/utils/rbac.helpers";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const userRole = useAppSelector((state) => state.auth.user?.type);
  const navItems = filterByRole(NAV_ITEMS, userRole);

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20">
          <span className="text-sm font-bold text-primary">A</span>
        </div>
        <span className="text-lg font-bold tracking-wide text-sidebar-foreground">
          A.S.M.S
        </span>
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
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRightIcon className="size-3.5 opacity-40 transition-opacity group-hover:opacity-70" />
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
