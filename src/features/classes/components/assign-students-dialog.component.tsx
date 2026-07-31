import { useMemo, useState } from "react";
import { LoaderCircleIcon, SearchIcon, CheckIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchStudents, useAssignStudents } from "../api/classes.api";

interface AssignStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
  sectionLabel: string;
}

export function AssignStudentsDialog({
  open,
  onOpenChange,
  sectionId,
  sectionLabel,
}: AssignStudentsDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const { data: studentsData, isLoading } = useFetchStudents();
  const assignStudents = useAssignStudents();

  const available = useMemo(
    () =>
      (studentsData?.data ?? []).filter(
        (student) => student.sectionId !== sectionId,
      ),
    [studentsData, sectionId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return available;
    return available.filter((student) => {
      const name = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase();
      return name.includes(q) || student.phone?.toLowerCase().includes(q);
    });
  }, [available, query]);

  const toggle = (studentId: string) => {
    setSelected((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleAssign = () => {
    if (selected.length === 0) return;
    assignStudents.mutate(
      { studentIds: selected, sectionId },
      {
        onSuccess: () => {
          setSelected([]);
          setQuery("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Assign Students</DialogTitle>
          <DialogDescription>
            Select students to assign to {sectionLabel}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No unassigned students found.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border/50">
              {filtered.map((student) => {
                const isSelected = selected.includes(student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggle(student.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {student.firstName} {student.middleName}{" "}
                        {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Grade {student.startingGrade} ·{" "}
                        {student.phone ?? "No phone"}
                      </p>
                    </div>
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isSelected && <CheckIcon className="size-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelected([]);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selected.length === 0 || assignStudents.isPending}
          >
            {assignStudents.isPending
              ? "Assigning..."
              : `Assign (${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
