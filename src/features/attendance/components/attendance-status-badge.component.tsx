import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus } from "../types/attendance.types";

const STATUS_STYLES: Record<AttendanceStatus, "success" | "destructive" | "warning" | "secondary"> = {
  PRESENT: "success",
  ABSENT: "destructive",
  LATE: "warning",
  EXCUSED: "secondary",
};

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus | null }) {
  if (!status) {
    return <span className="text-muted-foreground">-</span>;
  }
  return (
    <Badge variant={STATUS_STYLES[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
