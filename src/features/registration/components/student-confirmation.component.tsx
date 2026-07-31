import { LoaderCircleIcon } from "lucide-react";
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
import { useFetchStudentConfirmation } from "../api/registration.api";

interface StudentConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function StudentConfirmationDialog({
  open,
  onOpenChange,
  studentId,
  studentName,
}: StudentConfirmationProps) {
  const { data, isLoading } = useFetchStudentConfirmation(studentId);

  const confirmation = data?.data;
  const entries: [string, unknown][] =
    confirmation && typeof confirmation === "object" && !Array.isArray(confirmation)
      ? Object.entries(confirmation)
      : [["value", confirmation]];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Enrollment Confirmation</DialogTitle>
          <DialogDescription>
            Confirmation details for {studentName}.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {entries.map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground">{key}</p>
                <p className="text-sm font-medium break-words">
                  {stringifyValue(value)}
                </p>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
