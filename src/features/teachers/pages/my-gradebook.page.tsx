import { useEffect, useMemo, useState } from "react";
import { LoaderCircleIcon, SaveIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { PageHeader } from "@/components/custom/page-header";
import {
  useFetchSlots,
  useFetchGradebook,
  useSubmitGradebookEntry,
  useSubmitResults,
  useFetchAcademicYears,
} from "@/features/academics/api/academics.api";
import type { GradebookStudent } from "@/features/academics/types/academics.types";
import { useFetchMySections } from "../api/teachers.api";

function GradebookTable({
  entries,
  isPending,
  onSave,
  onSubmit,
}: {
  entries: GradebookStudent[];
  isPending: boolean;
  onSave: (scores: Record<string, number>) => void;
  onSubmit: () => void;
}) {
  const [scores, setScores] = useState<Record<string, number | "">>(() => {
    const next: Record<string, number | ""> = {};
    entries.forEach((entry) => {
      next[entry.studentId] = entry.score ?? "";
    });
    return next;
  });

  const columns = [
    {
      title: "Student",
      key: "studentId",
      component: (_value: unknown, row: (typeof entries)[number]) => (
        <p className="font-medium text-foreground">
          {row.firstName} {row.lastName}
        </p>
      ),
    },
    {
      title: "Score",
      key: "score",
      component: (_value: unknown, row: (typeof entries)[number]) => (
        <Input
          className="w-28"
          type="number"
          min={0}
          value={scores[row.studentId] ?? ""}
          onChange={(e) =>
            setScores((prev) => ({
              ...prev,
              [row.studentId]:
                e.target.value === "" ? "" : Number(e.target.value),
            }))
          }
          aria-label="Score"
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (value: unknown) => (
        <span className="text-muted-foreground">{String(value ?? "-")}</span>
      ),
    },
  ];

  const handleSave = () => {
    const parsed: Record<string, number> = {};
    Object.entries(scores).forEach(([studentId, value]) => {
      if (value !== "" && Number.isFinite(Number(value))) {
        parsed[studentId] = Number(value);
      }
    });
    onSave(parsed);
  };

  return (
    <div className="space-y-4">
      <CustomTable
        data={entries}
        columns={columns}
        emptyMessage="No gradebook entries."
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSubmit} disabled={isPending}>
          <SendIcon />
          Submit Results
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          <SaveIcon />
          {isPending ? "Saving..." : "Save Grades"}
        </Button>
      </div>
    </div>
  );
}

export function MyGradebookPage() {
  const { data: sectionsData, isLoading: sectionsLoading } = useFetchMySections();
  const sections = sectionsData?.data ?? [];

  const { data: slotsData } = useFetchSlots();
  const slots = slotsData?.data ?? [];

  const { data: yearsData } = useFetchAcademicYears();
  const years = yearsData?.data ?? [];

  const classes = useMemo(() => {
    const map = new Map<
      string,
      { sectionId: string; sectionName: string; grade: number; subjectId: string; subjectName: string }
    >();
    sections.forEach((section) => {
      const key = `${section.sectionId}:${section.subjectId}`;
      if (!map.has(key)) {
        map.set(key, {
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          grade: section.grade,
          subjectId: section.subjectId,
          subjectName: section.subjectName,
        });
      }
    });
    return Array.from(map.values());
  }, [sections]);

  const [classKey, setClassKey] = useState("");
  const [slotId, setSlotId] = useState("");
  const [periodId, setPeriodId] = useState("");

  const selectedClass = classes.find((c) => `${c.sectionId}:${c.subjectId}` === classKey);

  useEffect(() => {
    if (periodId) return;
    const current = years.find((y) => y.isCurrent) ?? years[0];
    if (current?.periods?.[0]) {
      setPeriodId(current.periods[0].id);
    }
  }, [years, periodId]);

  const { data: gradebookData, isLoading, refetch } = useFetchGradebook({
    sectionId: selectedClass?.sectionId,
    subjectId: selectedClass?.subjectId,
    slotId: slotId || undefined,
    periodId: periodId || undefined,
  });

  const entries = gradebookData?.data?.entries ?? [];

  const submitEntry = useSubmitGradebookEntry();
  const submitResults = useSubmitResults();

  const handleClassChange = (value: string) => {
    setClassKey(value);
    setSlotId("");
  };

  const handleSave = (scores: Record<string, number>) => {
    if (!selectedClass) return;
    const payload = {
      sectionId: selectedClass.sectionId,
      subjectId: selectedClass.subjectId,
      slotId,
      periodId,
      entries: Object.entries(scores).map(([studentId, score]) => ({
        studentId,
        score,
      })),
    };
    submitEntry.mutate(payload, { onSuccess: () => refetch() });
  };

  const handleSubmit = () => {
    if (!selectedClass) return;
    submitResults.mutate(
      {
        sectionId: selectedClass.sectionId,
        subjectId: selectedClass.subjectId,
        slotId,
        periodId,
      },
      { onSuccess: () => refetch() },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Gradebook"
        description="Enter and submit grades for your assigned classes."
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Class</label>
              <Select
                value={classKey}
                onChange={(e) => handleClassChange(e.target.value)}
                disabled={sectionsLoading}
              >
                <option value="" disabled>
                  Select class
                </option>
                {classes.map((c) => (
                  <option key={`${c.sectionId}:${c.subjectId}`} value={`${c.sectionId}:${c.subjectId}`}>
                    Section {c.sectionName} · {c.subjectName}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Slot</label>
              <Select value={slotId} onChange={(e) => setSlotId(e.target.value)} disabled={!classKey}>
                <option value="" disabled>
                  Select slot
                </option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name} ({slot.slotType})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Period</label>
              <Select value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
                {years.map((year) => (
                  <optgroup key={year.id} label={year.name}>
                    {year.periods.map((period) => (
                      <option key={period.id} value={period.id}>
                        {period.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Gradebook
            {selectedClass && (
              <span className="ml-2 font-normal text-muted-foreground">
                Grade {selectedClass.grade} · {selectedClass.subjectName}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedClass || !slotId || !periodId ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Select a class, slot, and period to load the gradebook.
            </p>
          ) : isLoading ? (
            <div className="flex justify-center py-10">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No gradebook entries found for this selection.
            </p>
          ) : (
            <GradebookTable
              key={`${classKey}-${slotId}-${periodId}`}
              entries={entries}
              isPending={submitEntry.isPending || submitResults.isPending}
              onSave={handleSave}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}