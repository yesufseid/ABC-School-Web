import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  LogInIcon,
  LogOutIcon,
  RefreshCwIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTable } from "@/components/custom/custom-table";
import { useAuthContext } from "@/lib/store";
import {
  useFetchStaffAttendance,
  useStaffCheckIn,
  useStaffCheckOut,
  useFetchPayrollSummary,
} from "../api/attendance.api";

export function StaffAttendance() {
  const { branchId } = useAuthContext();

  const [dateFrom, setDateFrom] = useState(() =>
    format(new Date(), "yyyy-MM-01"),
  );
  const [dateTo, setDateTo] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const { data: recordsData, isLoading, refetch } = useFetchStaffAttendance({
    branchId: branchId ?? undefined,
    dateFrom,
    dateTo,
  });
  const records = recordsData?.data ?? [];

  const { data: payrollData } = useFetchPayrollSummary(
    branchId ?? "",
    dateFrom,
    dateTo,
  );
  const payroll = payrollData?.data;

  const checkIn = useStaffCheckIn();
  const checkOut = useStaffCheckOut();

  const handleCheckIn = () => {
    checkIn.mutate({ branchId: branchId ?? undefined });
  };

  const handleCheckOut = () => {
    checkOut.mutate({ branchId: branchId ?? undefined });
  };

  const columns = [
    {
      title: "Profile",
      key: "profileId",
      component: (value: (typeof records)[number][keyof (typeof records)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Date",
      key: "date",
      component: (value: (typeof records)[number][keyof (typeof records)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "Check In",
      key: "checkIn",
      component: (value: (typeof records)[number][keyof (typeof records)[number]]) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {value ? format(parseISO(String(value)), "HH:mm") : "-"}
        </span>
      ),
    },
    {
      title: "Check Out",
      key: "checkOut",
      component: (value: (typeof records)[number][keyof (typeof records)[number]]) => (
        <span className="font-medium text-red-600 dark:text-red-400">
          {value ? format(parseISO(String(value)), "HH:mm") : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date From
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="Date from"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date To
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="Date to"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCwIcon />
                Refresh
              </Button>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                className="text-emerald-600 dark:text-emerald-400"
                onClick={handleCheckIn}
                disabled={checkIn.isPending}
              >
                <LogInIcon />
                {checkIn.isPending ? "Checking in..." : "Check In"}
              </Button>
              <Button
                variant="outline"
                className="text-red-600 dark:text-red-400"
                onClick={handleCheckOut}
                disabled={checkOut.isPending}
              >
                <LogOutIcon />
                {checkOut.isPending ? "Checking out..." : "Check Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-foreground">
              {payroll?.staffCount ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Staff Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {payroll?.presentDays ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Present Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {payroll?.absentDays ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Absent Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {payroll?.lateDays ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Late Days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Staff Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!branchId ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <UsersIcon className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Select a branch to view staff attendance.
              </p>
            </div>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Loading records...</p>
          ) : (
            <CustomTable
              data={records}
              columns={columns}
              emptyMessage="No staff attendance records found for this period."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
