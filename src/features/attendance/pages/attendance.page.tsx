import { useState } from "react";
import { ClipboardCheckIcon, UsersIcon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { StudentAttendance } from "../components/student-attendance.component";
import { StaffAttendance } from "../components/staff-attendance.component";

type AttendanceTab = "students" | "staff";

const TABS: { id: AttendanceTab; label: string; icon: typeof UsersIcon }[] = [
  { id: "students", label: "Student Attendance", icon: UsersIcon },
  { id: "staff", label: "Staff Attendance", icon: ClipboardCheckIcon },
];

export function AttendancePage() {
  const { tenantId, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const [tab, setTab] = useState<AttendanceTab>("students");

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Record and review attendance">
        <ContextSelector
          branches={
            isAdminOrOwner
              ? branches.map((b) => ({ id: b.id, name: b.name }))
              : undefined
          }
        />
      </PageHeader>

      <div className="flex w-fit items-center gap-1 rounded-2xl border border-border/50 bg-card/50 p-1">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "students" ? <StudentAttendance /> : <StaffAttendance />}
    </div>
  );
}
