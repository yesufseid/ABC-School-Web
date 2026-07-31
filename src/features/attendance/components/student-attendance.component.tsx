import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, SaveIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { useAuthContext } from "@/lib/store";
import { useFetchGrades, useFetchSections } from "@/features/classes/api/classes.api";
import {
  useFetchSectionAttendanceSheet,
  useTakeAttendance,
  useFetchAttendanceStatistics,
} from "../api/attendance.api";
import type { AttendanceStatus } from "../types/attendance.types";
import { AttendanceStatusBadge } from "./attendance-status-badge.component";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

export function StudentAttendance() {
  const { branchId, year } = useAuthContext();

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const [gradeId, setGradeId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const { data: sectionsData } = useFetchSections(
    gradeId && branchId ? { gradeId, branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  const { data: sheetData, isLoading: sheetLoading } =
    useFetchSectionAttendanceSheet(sectionId, date);

  const { data: statsData } = useFetchAttendanceStatistics({
    branchId: branchId ?? undefined,
    gradeId: gradeId || undefined,
    sectionId: sectionId || undefined,
    dateFrom: date,
    dateTo: date,
  });

  const [overrides, setOverrides] = useState<Record<string, AttendanceStatus>>({});

  const students = useMemo(
    () => sheetData?.data?.entries ?? [],
    [sheetData],
  );

  const effectiveStatus = (studentId: string, recorded: AttendanceStatus | null | undefined) =>
    overrides[studentId] ?? recorded ?? null;

  const takeAttendance = useTakeAttendance();

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

  const handleGradeChange = (value: string) => {
    setGradeId(value);
    setSectionId("");
    setOverrides({});
  };

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
        onSuccess: () => {
          setOverrides({});
        },
      },
    );
  };

  const columns = [
    {
      title: "Student",
      key: "studentId",
      component: (_value: (typeof students)[number][keyof (typeof students)[number]], row: (typeof students)[number]) => (
        <div>
          <p className="font-medium text-foreground">
            {row.firstName} {row.lastName}
          </p>
          {row.middleName && (
            <p className="text-xs text-muted-foreground">{row.middleName}</p>
          )}
        </div>
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
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Grade</label>
              <Select
                value={gradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
              >
                <option value="" disabled>
                  Select grade
                </option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    Grade {grade.grade}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Section</label>
              <Select
                value={sectionId}
                onChange={(e) => handleSectionChange(e.target.value)}
                disabled={!gradeId}
              >
                <option value="" disabled>
                  {gradeId ? "Select section" : "Select grade first"}
                </option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                aria-label="Date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.PRESENT}
            </p>
            <p className="text-xs text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {summary.ABSENT}
            </p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {summary.LATE}
            </p>
            <p className="text-xs text-muted-foreground">Late</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {summary.EXCUSED}
            </p>
            <p className="text-xs text-muted-foreground">Excused</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Attendance Sheet
            </CardTitle>
            {statsData?.data && statsData.data.attendanceRate > 0 && (
              <p className="text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 inline size-3.5" />
                Rate: {statsData.data.attendanceRate.toFixed(1)}%
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sectionId ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <UsersIcon className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Select a grade and section to load the attendance sheet.
              </p>
            </div>
          ) : sheetLoading ? (
            <p className="text-sm text-muted-foreground">Loading attendance...</p>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No students found for this section on the selected date.
              </p>
            </div>
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
