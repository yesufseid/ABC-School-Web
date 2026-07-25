import { NavLink, Outlet } from "react-router";
import { UserMenu } from "@/components/custom/user-menu.component";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/schools", label: "Schools", end: false },
  { to: "/subscriptions", label: "Subscriptions", end: false },
] as const;

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-6">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight text-primary"
          >
            Axis SMS
          </NavLink>

          <div className="flex items-center gap-5">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
