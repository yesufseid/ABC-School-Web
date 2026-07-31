import { useMemo, useState } from "react";
import { SaveIcon, SendIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { useAuthContext } from "@/lib/store";
import { useFetchGrades, useFetchSections } from "@/features/classes/api/classes.api";
import { useFetchSlots, useFetchGradebook, useSubmitGradebookEntry, useSubmitResults } from "../api/academics.api";
import type { GradeCycle, GradebookStudent } from "../types/academics.types";

function gradeCycleFromGrade(grade: number): GradeCycle {
  if (grade <= 0) return "KG";
  if (grade <= 4) return "LOWER_PRIMARY";
  if (grade <= 8) return "UPPER_PRIMARY";
  return "SECONDARY";
}

function GradebookTable({
  entries,
  onSave,
  onSubmitResults,
  isPending,
}: {
  entries: GradebookStudent[];
  onSave: (scores: Record<string, number>) => void;
  onSubmitResults: () => void;
  isPending: boolean;
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
      component: (_value: (typeof entries)[number][keyof (typeof entries)[number]], row: (typeof entries)[number]) => (
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
      title: "Score",
      key: "score",
      component: (_value: (typeof entries)[number][keyof (typeof entries)[number]], row: (typeof entries)[number]) => (
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
      component: (value: (typeof entries)[number][keyof (typeof entries)[number]]) => (
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
        <Button variant="outline" onClick={onSubmitResults} disabled={isPending}>
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

export function GradebookComponent() {
  const { branchId, year, term: contextTerm } = useAuthContext();

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const { data: slotsData } = useFetchSlots();
  const slots = slotsData?.data ?? [];

  const [gradeId, setGradeId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [term, setTerm] = useState(contextTerm);

  const selectedGrade = grades.find((g) => g.id === gradeId);

  const { data: sectionsData } = useFetchSections(
    gradeId && branchId ? { gradeId, branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  const cycle = selectedGrade ? gradeCycleFromGrade(selectedGrade.grade) : undefined;
  const availableSlots = cycle
    ? slots.filter((slot) => slot.gradeCycle === cycle)
    : slots;

  const { data: gradebookData, isLoading, refetch } = useFetchGradebook({
    sectionId: sectionId || undefined,
    subjectId: subjectId || undefined,
    slotId: slotId || undefined,
    term: term || undefined,
  });

  const gradebookEntries = useMemo(
    () => gradebookData?.data?.entries ?? [],
    [gradebookData],
  );

  const submitEntry = useSubmitGradebookEntry();
  const submitResults = useSubmitResults();

  const resetKey = `${sectionId}-${subjectId}-${slotId}-${term}`;

  const handleSave = (scores: Record<string, number>) => {
    const entries = Object.entries(scores).map(([studentId, score]) => ({
      studentId,
      score,
    }));

    submitEntry.mutate(
      {
        sectionId,
        subjectId,
        slotId,
        term,
        entries,
      },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const handleSubmitResults = () => {
    submitResults.mutate({ sectionId, subjectId, slotId, term });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Grade</label>
              <Select
                value={gradeId}
                onChange={(e) => {
                  setGradeId(e.target.value);
                  setSectionId("");
                  setSubjectId("");
                  setSlotId("");
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!selectedGrade}
              >
                <option value="" disabled>
                  {selectedGrade ? "Select subject" : "Select grade first"}
                </option>
                {selectedGrade?.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Slot</label>
              <Select
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                disabled={!cycle}
              >
                <option value="" disabled>
                  {cycle ? "Select slot" : "Select grade first"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name} ({slot.slotType})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Term</label>
              <Select value={term} onChange={(e) => setTerm(e.target.value)}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Gradebook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sectionId || !subjectId || !slotId || !term ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Select a grade, section, subject, slot, and term to load the gradebook.
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-10">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : gradebookEntries.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No gradebook entries found for this selection.
            </p>
          ) : (
            <GradebookTable
              key={resetKey}
              entries={gradebookEntries}
              onSave={handleSave}
              onSubmitResults={handleSubmitResults}
              isPending={submitEntry.isPending || submitResults.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
