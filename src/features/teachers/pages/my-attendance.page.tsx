import { useMemo, useState } from "react";
import { format } from "date-fns";
import { LoaderCircleIcon, SaveIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { PageHeader } from "@/components/custom/page-header";
import {
  useFetchSectionAttendanceSheet,
  useTakeAttendance,
} from "@/features/attendance/api/attendance.api";
import { AttendanceStatusBadge } from "@/features/attendance/components/attendance-status-badge.component";
import type { AttendanceStatus } from "@/features/attendance/types/attendance.types";
import { useFetchMySections } from "../api/teachers.api";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

export function MyAttendancePage() {
  const { data: sectionsData, isLoading: sectionsLoading } = useFetchMySections();
  const sections = sectionsData?.data ?? [];

  const distinctSections = useMemo(() => {
    const map = new Map<string, { sectionId: string; sectionName: string; grade: number }>();
    sections.forEach((section) => {
      if (!map.has(section.sectionId)) {
        map.set(section.sectionId, {
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          grade: section.grade,
        });
      }
    });
    return Array.from(map.values());
  }, [sections]);

  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [overrides, setOverrides] = useState<Record<string, AttendanceStatus>>({});

  const { data: sheetData, isLoading: sheetLoading } =
    useFetchSectionAttendanceSheet(sectionId, date);

  const students = sheetData?.data?.entries ?? [];

  const takeAttendance = useTakeAttendance();

  const effectiveStatus = (
    studentId: string,
    recorded: AttendanceStatus | null | undefined,
  ) => overrides[studentId] ?? recorded ?? null;

  const summary = useMemo(() => {
    const counts: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };
    students.forEach((entry) => {
      const status = overrides[entry.studentId] ?? entry.status ?? null;
      if (status) counts[status] += 1;
    });
    return counts;
  }, [students, overrides]);

  const handleSectionChange = (value: string) => {
    setSectionId(value);
    setOverrides({});
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setOverrides({});
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setOverrides((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    const entries = students
      .map((entry) => ({
        studentId: entry.studentId,
        status: effectiveStatus(entry.studentId, entry.status),
      }))
      .filter((entry): entry is { studentId: string; status: AttendanceStatus } =>
        entry.status !== null,
      );

    if (entries.length === 0) return;

    takeAttendance.mutate(
      { sectionId, date, entries },
      {
        onSuccess: () => setOverrides({}),
      },
    );
  };

  const columns = [
    {
      title: "Student",
      key: "studentId",
      component: (_value: (typeof students)[number][keyof (typeof students)[number]], row: (typeof students)[number]) => (
        <p className="font-medium text-foreground">
          {row.firstName} {row.lastName}
        </p>
      ),
    },
    {
      title: "Sex",
      key: "sex",
      component: (value: (typeof students)[number][keyof (typeof students)[number]]) => (
        <span className="text-muted-foreground">{String(value ?? "-")}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (_value: (typeof students)[number][keyof (typeof students)[number]], row: (typeof students)[number]) => (
        <Select
          className="w-36"
          value={effectiveStatus(row.studentId, row.status) ?? ""}
          onChange={(e) =>
            handleStatusChange(row.studentId, e.target.value as AttendanceStatus)
          }
        >
          <option value="" disabled>
            Select
          </option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>
      ),
    },
    {
      title: "Recorded",
      key: "recorded",
      component: (_value: (typeof students)[number][keyof (typeof students)[number]], row: (typeof students)[number]) => (
        <AttendanceStatusBadge status={row.status ?? null} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        description="Take and manage attendance for your sections."
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Section</label>
              <Select
                value={sectionId}
                onChange={(e) => handleSectionChange(e.target.value)}
                disabled={sectionsLoading}
              >
                <option value="" disabled>
                  Select section
                </option>
                {distinctSections.map((section) => (
                  <option key={section.sectionId} value={section.sectionId}>
                    Section {section.sectionName} · Grade {section.grade}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <Input type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} aria-label="Date" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Totals
              </label>
              <p className="pt-2 text-sm text-muted-foreground">
                Present {summary.PRESENT} · Absent {summary.ABSENT} · Late{" "}
                {summary.LATE} · Excused {summary.EXCUSED}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <UsersIcon className="size-4" />
            Attendance Sheet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sectionId ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Select a section to load the attendance sheet.
            </p>
          ) : sheetLoading ? (
            <div className="flex justify-center py-10">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No students found for this section on the selected date.
            </p>
          ) : (
            <>
              <CustomTable
                data={students}
                columns={columns}
                emptyMessage="No students in this section."
              />
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={takeAttendance.isPending}>
                  <SaveIcon />
                  {takeAttendance.isPending ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}