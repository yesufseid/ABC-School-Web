import { useState } from "react";
import { format, parseISO } from "date-fns";
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import {
  useFetchAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
  useSetCurrentAcademicYear,
  useCreatePeriod,
  useUpdatePeriod,
  useDeletePeriod,
} from "../api/academics.api";
import { AcademicYearForm } from "../forms/academic-year.form";
import type { YearFormValues } from "../forms/academic-year.form";
import { AcademicPeriodForm } from "../forms/academic-period.form";
import type { PeriodFormValues } from "../forms/academic-period.form";
import type { AcademicYear, AcademicPeriod } from "../types/academics.types";

const YEAR_STATUS_STYLES: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  ACTIVE: "success",
  COMPLETED: "secondary",
  CLOSED: "destructive",
};

const PERIOD_TYPE_STYLES: Record<string, "default" | "secondary"> = {
  SEMESTER: "secondary",
  TERM: "default",
};

function MakeCurrentButton({ yearId, disabled }: { yearId: string; disabled?: boolean }) {
  const setCurrent = useSetCurrentAcademicYear(yearId);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setCurrent.mutate(undefined)}
      disabled={disabled || setCurrent.isPending}
    >
      <StarIcon />
      {setCurrent.isPending ? "..." : "Set Current"}
    </Button>
  );
}

function formatRange(start?: string, end?: string): string {
  if (!start && !end) return "-";
  const startLabel = start ? format(parseISO(start), "MMM d, yyyy") : "";
  const endLabel = end ? format(parseISO(end), "MMM d, yyyy") : "";
  return [startLabel, endLabel].filter(Boolean).join(" – ") || "-";
}

export function AcademicCalendarComponent() {
  const { role } = useAuthContext();
  const isOwner = role === "Owner";
  const canManage = isOwner || role === "Principal";

  const { data: yearsData, isLoading } = useFetchAcademicYears();
  const years = yearsData?.data ?? [];

  const [yearFormOpen, setYearFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [deleteYearOpen, setDeleteYearOpen] = useState(false);
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null);

  const [periodFormOpen, setPeriodFormOpen] = useState(false);
  const [periodYear, setPeriodYear] = useState<AcademicYear | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(null);
  const [deletePeriodOpen, setDeletePeriodOpen] = useState(false);
  const [deletingPeriod, setDeletingPeriod] = useState<AcademicPeriod | null>(null);

  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear(editingYear?.id ?? "");
  const deleteYear = useDeleteAcademicYear(deletingYear?.id ?? "");

  const createPeriod = useCreatePeriod(periodYear?.id ?? "");
  const updatePeriod = useUpdatePeriod(editingPeriod?.id ?? "");
  const deletePeriod = useDeletePeriod(deletingPeriod?.id ?? "");

  const handleYearSubmit = (values: YearFormValues) => {
    if (editingYear) {
      updateYear.mutate(values, {
        onSuccess: () => {
          setYearFormOpen(false);
          setEditingYear(null);
        },
      });
    } else {
      createYear.mutate(values, {
        onSuccess: () => {
          setYearFormOpen(false);
        },
      });
    }
  };

  const handlePeriodSubmit = (values: PeriodFormValues) => {
    if (editingPeriod) {
      updatePeriod.mutate(values, {
        onSuccess: () => {
          setPeriodFormOpen(false);
          setEditingPeriod(null);
          setPeriodYear(null);
        },
      });
    } else {
      createPeriod.mutate(values, {
        onSuccess: () => {
          setPeriodFormOpen(false);
          setPeriodYear(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Academic Years</CardTitle>
            {isOwner && (
              <Button
                size="sm"
                onClick={() => {
                  setEditingYear(null);
                  setYearFormOpen(true);
                }}
              >
                <PlusIcon />
                Add Academic Year
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading academic calendar...
            </p>
          ) : years.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No academic years configured yet.
            </p>
          ) : (
            <div className="space-y-4">
              {years.map((year) => (
                <Card key={year.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-sm font-medium">{year.name}</CardTitle>
                        {year.isCurrent && (
                          <Badge variant="success">
                            <StarIcon className="size-3" />
                            Current
                          </Badge>
                        )}
                        <Badge variant={YEAR_STATUS_STYLES[year.status] ?? "secondary"}>
                          {year.status}
                        </Badge>
                        <Badge variant="secondary">{year.calendarType}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatRange(year.startDate, year.endDate)}
                        </span>
                      </div>
                      {canManage && (
                        <div className="flex gap-1.5">
                          {!year.isCurrent && <MakeCurrentButton yearId={year.id} />}
                          {isOwner && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingYear(year);
                                  setYearFormOpen(true);
                                }}
                              >
                                <PencilIcon />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 dark:text-red-400"
                                onClick={() => {
                                  setDeletingYear(year);
                                  setDeleteYearOpen(true);
                                }}
                              >
                                <TrashIcon />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Periods</p>
                      {isOwner && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPeriodYear(year);
                            setEditingPeriod(null);
                            setPeriodFormOpen(true);
                          }}
                        >
                          <PlusIcon />
                          Add Period
                        </Button>
                      )}
                    </div>
                    <CustomTable
                      data={year.periods}
                      columns={[
                        {
                          title: "Name",
                          key: "name",
                          component: (value: (typeof year.periods)[number][keyof (typeof year.periods)[number]]) => (
                            <span className="font-medium text-foreground">{String(value)}</span>
                          ),
                        },
                        {
                          title: "Sequence",
                          key: "sequence",
                          component: (value: (typeof year.periods)[number][keyof (typeof year.periods)[number]]) => (
                            <span className="text-muted-foreground">{String(value)}</span>
                          ),
                        },
                        {
                          title: "Type",
                          key: "type",
                          component: (value: (typeof year.periods)[number][keyof (typeof year.periods)[number]]) => (
                            <Badge variant={PERIOD_TYPE_STYLES[String(value)] ?? "secondary"}>
                              {String(value)}
                            </Badge>
                          ),
                        },
                        {
                          title: "Dates",
                          key: "startDate",
                          component: (_value: (typeof year.periods)[number][keyof (typeof year.periods)[number]], row: (typeof year.periods)[number]) => (
                            <span className="text-muted-foreground">
                              {formatRange(row.startDate, row.endDate)}
                            </span>
                          ),
                        },
                        {
                          title: "",
                          key: "actions",
                          className: "w-24",
                          component: (_value: (typeof year.periods)[number][keyof (typeof year.periods)[number]], row: (typeof year.periods)[number]) =>
                            isOwner ? (
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setPeriodYear(year);
                                    setEditingPeriod(row);
                                    setPeriodFormOpen(true);
                                  }}
                                >
                                  <PencilIcon />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => {
                                    setDeletingPeriod(row);
                                    setDeletePeriodOpen(true);
                                  }}
                                >
                                  <TrashIcon />
                                </Button>
                              </div>
                            ) : null,
                        },
                      ]}
                      emptyMessage="No periods for this year."
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AcademicYearForm
        open={yearFormOpen}
        onOpenChange={setYearFormOpen}
        year={editingYear}
        onSubmit={handleYearSubmit}
        isPending={createYear.isPending || updateYear.isPending}
      />

      <AcademicPeriodForm
        open={periodFormOpen}
        onOpenChange={setPeriodFormOpen}
        period={editingPeriod}
        calendarType={periodYear?.calendarType ?? "TERM"}
        onSubmit={handlePeriodSubmit}
        isPending={createPeriod.isPending || updatePeriod.isPending}
      />

      <ConfirmDialog
        open={deleteYearOpen}
        onOpenChange={setDeleteYearOpen}
        title="Delete Academic Year"
        description={`Are you sure you want to delete "${deletingYear?.name}" and all of its periods? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingYear) {
            deleteYear.mutate(undefined, {
              onSuccess: () => {
                setDeleteYearOpen(false);
                setDeletingYear(null);
              },
            });
          }
        }}
        isPending={deleteYear.isPending}
      />

      <ConfirmDialog
        open={deletePeriodOpen}
        onOpenChange={setDeletePeriodOpen}
        title="Delete Period"
        description={`Are you sure you want to delete "${deletingPeriod?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingPeriod) {
            deletePeriod.mutate(undefined, {
              onSuccess: () => {
                setDeletePeriodOpen(false);
                setDeletingPeriod(null);
              },
            });
          }
        }}
        isPending={deletePeriod.isPending}
      />
    </div>
  );
}
