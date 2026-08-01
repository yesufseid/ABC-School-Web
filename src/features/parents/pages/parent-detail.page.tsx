import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailItem } from "@/components/custom/detail-item";
import { useFetchParent } from "../api/parents.api";

function formatDate(value?: string | null) {
  return value ? format(parseISO(value), "MMM d, yyyy") : "-";
}

export function ParentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useFetchParent(id ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/parents")}>
          <ArrowLeftIcon />
          Back to Parents
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load parent details.
          </p>
        </div>
      </div>
    );
  }

  const parent = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/parents")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {parent.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {parent.parentId} · {parent.phone}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Parent ID" value={parent.parentId} />
            <DetailItem label="Full Name" value={parent.name} />
            <DetailItem label="Sex" value={parent.sex} />
            <DetailItem label="Phone" value={parent.phone} />
            <DetailItem label="Address" value={parent.address} />
            <DetailItem label="Nationality" value={parent.nationality} />
            <DetailItem label="Joined" value={formatDate(parent.createdAt)} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Children ({parent.students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parent.students.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No children linked.
              </p>
            ) : (
              <div className="space-y-4">
                {parent.students.map((link) => {
                  const student = link.student;
                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/50 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="cursor-pointer text-left hover:underline"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {student.firstName}{" "}
                          {student.middleName ? `${student.middleName} ` : ""}
                          {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.studentId} · Grade {student.startingGrade} ·{" "}
                          {student.status}
                        </p>
                      </button>
                      <Badge variant="outline">{link.relation}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
