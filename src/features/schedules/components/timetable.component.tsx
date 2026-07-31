import { useState } from "react";
import { LoaderCircleIcon, Wand2Icon, CheckCircle2Icon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchGrades, useFetchSections } from "@/features/classes/api/classes.api";
import {
  useFetchTimetable,
  useGenerateTimetable,
  useActivateTimetable,
  useDeleteTimetableEntry,
} from "../api/schedules.api";
import type { TimetableEntry } from "../types/schedule.types";

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function TimetableComponent() {
  const { branchId, year } = useAuthContext();

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const [gradeId, setGradeId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const { data: sectionsData } = useFetchSections(
    gradeId && branchId ? { gradeId, branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  const { data: timetableData, isLoading, refetch } = useFetchTimetable(sectionId, year);
  const entries = timetableData?.data?.entries ?? [];

  const generateTimetable = useGenerateTimetable();
  const activateTimetable = useActivateTimetable(sectionId);
  const deleteEntry = useDeleteTimetableEntry(sectionId);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<TimetableEntry | null>(null);

  const handleGenerate = () => {
    generateTimetable.mutate(
      { sectionId, year },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const handleActivate = () => {
    activateTimetable.mutate(undefined, {
      onSuccess: () => refetch(),
    });
  };

  const columns = [
    {
      title: "Day",
      key: "day",
      component: (value: (typeof entries)[number][keyof (typeof entries)[number]]) => {
        const dayIndex = Number(value);
        return (
          <span className="font-medium text-foreground">
            {DAY_LABELS[dayIndex] ?? String(value)}
          </span>
        );
      },
    },
    {
      title: "Period",
      key: "period",
      component: (value: (typeof entries)[number][keyof (typeof entries)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Subject",
      key: "subjectName",
      component: (
        _value: (typeof entries)[number][keyof (typeof entries)[number]],
        row: (typeof entries)[number],
      ) => <span className="text-foreground">{row.subjectName ?? row.subjectId ?? "-"}</span>,
    },
    {
      title: "Teacher",
      key: "teacherName",
      component: (
        _value: (typeof entries)[number][keyof (typeof entries)[number]],
        row: (typeof entries)[number],
      ) => <span className="text-muted-foreground">{row.teacherName ?? row.teacherId ?? "-"}</span>,
    },
    {
      title: "Time",
      key: "startTime",
      component: (
        _value: (typeof entries)[number][keyof (typeof entries)[number]],
        row: (typeof entries)[number],
      ) => (
        <span className="text-muted-foreground">
          {row.startTime ?? "-"} - {row.endTime ?? "-"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "isActive",
      component: (value: (typeof entries)[number][keyof (typeof entries)[number]]) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-12",
      component: (
        _value: (typeof entries)[number][keyof (typeof entries)[number]],
        row: (typeof entries)[number],
      ) => (
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 dark:text-red-400"
          onClick={() => {
            setDeletingEntry(row);
            setDeleteOpen(true);
          }}
        >
          <TrashIcon />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Grade</label>
              <Select
                value={gradeId}
                onChange={(e) => {
                  setGradeId(e.target.value);
                  setSectionId("");
                }}
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
                onChange={(e) => setSectionId(e.target.value)}
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
          </div>
        </CardContent>
      </Card>

      {!sectionId ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Select a grade and section to view its timetable.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">
                Timetable - {year}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleActivate}
                  disabled={activateTimetable.isPending || entries.length === 0}
                >
                  <CheckCircle2Icon />
                  {activateTimetable.isPending ? "Activating..." : "Activate"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generateTimetable.isPending}
                >
                  <Wand2Icon />
                  {generateTimetable.isPending ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CustomTable
                data={entries}
                columns={columns}
                emptyMessage="No timetable generated for this section yet."
              />
            )}
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remove Timetable Entry"
        description="Are you sure you want to remove this timetable entry? This action cannot be undone."
        confirmLabel="Remove"
        onConfirm={() => {
          if (deletingEntry) {
            deleteEntry.mutate(undefined, {
              onSuccess: () => {
                setDeleteOpen(false);
                setDeletingEntry(null);
                refetch();
              },
            });
          }
        }}
        isPending={deleteEntry.isPending}
      />
    </div>
  );
}
