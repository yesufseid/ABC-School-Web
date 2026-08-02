import { useMemo, useState } from "react";
import { LoaderCircleIcon, UsersIcon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { CustomTable } from "@/components/custom/custom-table";
import { useFetchMyStudents } from "../api/teachers.api";

export function MyStudentsPage() {
  const { data, isLoading, isError } = useFetchMyStudents();
  const students = data?.data ?? [];

  const [sectionId, setSectionId] = useState("");

  const sections = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((student) => {
      if (!map.has(student.sectionId)) {
        map.set(student.sectionId, student.sectionName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [students]);

  const filtered = useMemo(
    () => (sectionId ? students.filter((s) => s.sectionId === sectionId) : students),
    [students, sectionId],
  );

  const columns = [
{
      title: "Student",
      key: "studentCode",
      component: (_value: unknown, row: (typeof filtered)[number]) => (
        <div>
          <p className="font-medium text-foreground">{row.studentName}</p>
          <p className="text-xs text-muted-foreground">{row.studentCode}</p>
        </div>
      ),
    },
    {
      title: "Section",
      key: "sectionName",
      component: (value: unknown) => (
        <span className="text-muted-foreground">{String(value ?? "-")}</span>
      ),
    },
    {
      title: "Grade",
      key: "grade",
      component: (value: unknown) => (
        <span className="text-muted-foreground">Grade {String(value ?? "-")}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load your students.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Students"
        description="Students enrolled in your assigned sections."
      />

      <Card>
        <CardContent className="pt-6">
          <div className="max-w-xs space-y-2">
            <label className="text-sm font-medium text-foreground">Section</label>
            <Select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
            >
              <option value="">All sections</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <UsersIcon className="size-4" />
            Roster ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={filtered}
            columns={columns}
            emptyMessage="No students assigned to your sections."
          />
        </CardContent>
      </Card>
    </div>
  );
}