import { useState } from "react";
import { LoaderCircleIcon, Wand2Icon, CheckIcon, XIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailItem } from "@/components/custom/detail-item";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchGrades, useFetchSections } from "@/features/classes/api/classes.api";
import { useFetchRoster, useGenerateRoster, useApproveRoster, useRejectRoster, usePublishRoster } from "../api/academics.api";

const ROSTER_STATUS_STYLES: Record<string, "default" | "secondary" | "success" | "destructive" | "warning"> = {
  DRAFT: "secondary",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  PUBLISHED: "default",
};

export function RostersComponent() {
  const { branchId, year, term } = useAuthContext();

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const [gradeId, setGradeId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const { data: sectionsData } = useFetchSections(
    gradeId && branchId ? { gradeId, branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  const { data: rosterData, isLoading, refetch } = useFetchRoster(sectionId);
  const roster = rosterData?.data;

  const generateRoster = useGenerateRoster(sectionId, term, year);
  const approveRoster = useApproveRoster(roster?.id ?? "");
  const rejectRoster = useRejectRoster(roster?.id ?? "");
  const publishRoster = usePublishRoster();

  const [rejectOpen, setRejectOpen] = useState(false);

  const handleGenerate = () => {
    generateRoster.mutate(undefined, { onSuccess: () => refetch() });
  };

  const handleApprove = () => {
    approveRoster.mutate(undefined, { onSuccess: () => refetch() });
  };

  const handlePublish = () => {
    publishRoster.mutate(
      { term, year, sectionIds: [sectionId] },
      { onSuccess: () => refetch() },
    );
  };

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
          Select a grade and section to view its roster.
        </p>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : roster ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Roster</CardTitle>
              <Badge variant={ROSTER_STATUS_STYLES[roster.status] ?? "secondary"}>
                {roster.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Term" value={roster.term} />
            <DetailItem label="Year" value={roster.year} />
            {roster.note && <DetailItem label="Note" value={roster.note} />}

            <div className="flex flex-wrap gap-2 pt-2">
              {roster.status === "DRAFT" && (
                <Button onClick={handleGenerate} disabled={generateRoster.isPending}>
                  <Wand2Icon />
                  {generateRoster.isPending ? "Generating..." : "Generate"}
                </Button>
              )}
              {(roster.status === "PENDING" || roster.status === "DRAFT") && (
                <Button
                  variant="outline"
                  className="text-emerald-600 dark:text-emerald-400"
                  onClick={handleApprove}
                  disabled={approveRoster.isPending}
                >
                  <CheckIcon />
                  Approve
                </Button>
              )}
              {(roster.status === "PENDING" || roster.status === "DRAFT") && (
                <Button
                  variant="outline"
                  className="text-red-600 dark:text-red-400"
                  onClick={() => setRejectOpen(true)}
                  disabled={rejectRoster.isPending}
                >
                  <XIcon />
                  Reject
                </Button>
              )}
              {roster.status === "APPROVED" && (
                <Button onClick={handlePublish} disabled={publishRoster.isPending}>
                  <SendIcon />
                  {publishRoster.isPending ? "Publishing..." : "Publish"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">No Roster Yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              No roster exists for this section yet. Generate one to begin.
            </p>
            <Button onClick={handleGenerate} disabled={generateRoster.isPending}>
              <Wand2Icon />
              {generateRoster.isPending ? "Generating..." : "Generate Roster"}
            </Button>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject Roster"
        description="Are you sure you want to reject this roster? You can generate a new one afterwards."
        confirmLabel="Reject"
        onConfirm={() => {
          rejectRoster.mutate(
            { note: "Rejected" },
            {
              onSuccess: () => {
                setRejectOpen(false);
                refetch();
              },
            },
          );
        }}
        isPending={rejectRoster.isPending}
      />
    </div>
  );
}
