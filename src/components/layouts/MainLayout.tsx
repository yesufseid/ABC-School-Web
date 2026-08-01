import { useState } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { AppHeader } from "@/components/custom/app-header";
import { NavigationProgress } from "@/components/layouts/NavigationProgress";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dark flex h-screen overflow-hidden bg-background">
      <NavigationProgress />
      <AppSidebar collapsed={collapsed} />

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <AppHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
