import { Outlet } from "react-router";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { AppHeader } from "@/components/custom/app-header";
import { NavigationProgress } from "@/components/layouts/NavigationProgress";

export default function MainLayout() {
  return (
    <div className="dark flex min-h-screen bg-background">
      <NavigationProgress />
      <AppSidebar />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <AppHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
