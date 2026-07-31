import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  SectionAttendanceSheet,
  SectionAttendanceEntry,
  AttendanceStatistics,
  StaffAttendanceRecord,
  PayrollSummary,
} from "../types/attendance.types";

export const attendanceKeys = {
  all: ["attendance"] as const,
  sheets: () => [...attendanceKeys.all, "sheet"] as const,
  sheet: (sectionId: string, date: string) =>
    [...attendanceKeys.sheets(), sectionId, date] as const,
  statistics: () => [...attendanceKeys.all, "statistics"] as const,
  staff: () => [...attendanceKeys.all, "staff"] as const,
  staffRecords: () => [...attendanceKeys.staff(), "list"] as const,
  staffRecord: (id: string) => [...attendanceKeys.staff(), id] as const,
  payroll: (branchId: string, periodStart: string, periodEnd: string) =>
    [...attendanceKeys.staff(), "payroll", branchId, periodStart, periodEnd] as const,
};

export function useFetchSectionAttendanceSheet(
  sectionId: string,
  date: string,
) {
  return useFetchQuery<{ data: SectionAttendanceSheet }>(
    API.ATTENDANCE_STUDENTS_SECTION(sectionId, date),
    attendanceKeys.sheet(sectionId, date),
    undefined,
    { enabled: !!sectionId && !!date },
  );
}

export function useFetchAttendanceStatistics(params: {
  branchId?: string;
  gradeId?: string;
  sectionId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const enabled = !!params.branchId;
  return useFetchQuery<{ data: AttendanceStatistics }>(
    API.ATTENDANCE_STUDENTS_STATISTICS,
    attendanceKeys.statistics(),
    params,
    { enabled },
  );
}

export function useFetchStudentAttendanceHistory(
  studentId: string,
  year: string,
) {
  return useFetchQuery<{ data: SectionAttendanceEntry[] }>(
    API.ATTENDANCE_STUDENTS_HISTORY(studentId),
    [...attendanceKeys.all, "history", studentId, year],
    { year },
    { enabled: !!studentId && !!year },
  );
}

export function useTakeAttendance() {
  return useApiMutation<
    { message: string },
    components["schemas"]["TakeAttendanceDto"]
  >(API.ATTENDANCE_STUDENTS, "post", {
    successMessage: "Attendance saved!",
    invalidateQueries: [
      { key: attendanceKeys.sheets() },
      { key: attendanceKeys.statistics() },
    ],
    mutationOptions: {},
  });
}

export function useCorrectAttendance(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["CorrectAttendanceDto"]
  >(API.ATTENDANCE_STUDENT_CORRECT(id), "post", {
    successMessage: "Attendance corrected!",
    invalidateQueries: [
      { key: attendanceKeys.sheets() },
      { key: attendanceKeys.statistics() },
    ],
    mutationOptions: {},
  });
}

export function useDirectEditAttendance(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["AttendanceEntryDto"]
  >(API.ATTENDANCE_STUDENT(id), "patch", {
    successMessage: "Attendance updated!",
    invalidateQueries: [
      { key: attendanceKeys.sheets() },
      { key: attendanceKeys.statistics() },
    ],
    mutationOptions: {},
  });
}

export function useFetchStaffAttendance(params: {
  branchId?: string;
  profileId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const enabled = !!params.branchId;
  return useFetchQuery<{ data: StaffAttendanceRecord[] }>(
    API.ATTENDANCE_STAFF,
    attendanceKeys.staffRecords(),
    params,
    { enabled },
  );
}

export function useStaffCheckIn() {
  return useApiMutation<{ message: string }, components["schemas"]["CheckInDto"]>(
    API.ATTENDANCE_STAFF_CHECK_IN,
    "post",
    {
      successMessage: "Checked in!",
      invalidateQueries: [{ key: attendanceKeys.staffRecords() }],
      mutationOptions: {},
    },
  );
}

export function useStaffCheckOut() {
  return useApiMutation<{ message: string }, components["schemas"]["CheckOutDto"]>(
    API.ATTENDANCE_STAFF_CHECK_OUT,
    "post",
    {
      successMessage: "Checked out!",
      invalidateQueries: [{ key: attendanceKeys.staffRecords() }],
      mutationOptions: {},
    },
  );
}

export function useFetchPayrollSummary(
  branchId: string,
  periodStart: string,
  periodEnd: string,
) {
  const enabled = !!branchId && !!periodStart && !!periodEnd;
  return useFetchQuery<{ data: PayrollSummary }>(
    API.ATTENDANCE_STAFF_PAYROLL(branchId),
    attendanceKeys.payroll(branchId, periodStart, periodEnd),
    { periodStart, periodEnd },
    { enabled },
  );
}
