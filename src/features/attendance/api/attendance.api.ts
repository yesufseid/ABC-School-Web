import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  AttendanceRecord,
  StaffAttendanceRecord,
  AttendanceStatistics,
  PayrollSummary,
} from "../types/attendance.types";

export const attendanceKeys = {
  all: ["attendance"] as const,
  section: (sectionId: string, date: string) =>
    [...attendanceKeys.all, "section", sectionId, date] as const,
  history: (studentId: string) =>
    [...attendanceKeys.all, "history", studentId] as const,
  statistics: () => [...attendanceKeys.all, "statistics"] as const,
};

export const staffAttendanceKeys = {
  all: ["staff-attendance"] as const,
  member: (id: string) => [...staffAttendanceKeys.all, id] as const,
  payroll: (branchId: string) =>
    [...staffAttendanceKeys.all, "payroll", branchId] as const,
};

export function useTakeAttendance() {
  return useApiMutation<
    { message: string },
    components["schemas"]["TakeAttendanceDto"]
  >(API.ATTENDANCE_STUDENTS, "post", {
    successMessage: "Attendance taken!",
    invalidateQueries: [{ key: attendanceKeys.all }],
    mutationOptions: {},
  });
}

export function useFetchSectionAttendance(sectionId: string, date: string) {
  return useFetchQuery<{ data: AttendanceRecord[] }>(
    API.ATTENDANCE_STUDENTS_SECTION(sectionId, date),
    attendanceKeys.section(sectionId, date),
    undefined,
    { enabled: !!sectionId && !!date },
  );
}

export function useFetchStudentHistory(studentId: string) {
  return useFetchQuery<{ data: AttendanceRecord[] }>(
    API.ATTENDANCE_STUDENTS_HISTORY(studentId),
    attendanceKeys.history(studentId),
    undefined,
    { enabled: !!studentId },
  );
}

export function useFetchAttendanceStatistics() {
  return useFetchQuery<{ data: AttendanceStatistics }>(
    API.ATTENDANCE_STUDENTS_STATISTICS,
    attendanceKeys.statistics(),
  );
}

export function useEditAttendance(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["AttendanceEntryDto"]
  >(API.ATTENDANCE_STUDENT(id), "patch", {
    successMessage: "Attendance updated!",
    invalidateQueries: [{ key: attendanceKeys.all }],
    mutationOptions: {},
  });
}

export function useCorrectAttendance(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["CorrectAttendanceDto"]
  >(API.ATTENDANCE_STUDENT_CORRECT(id), "post", {
    successMessage: "Attendance corrected!",
    invalidateQueries: [{ key: attendanceKeys.all }],
    mutationOptions: {},
  });
}

export function useCheckIn() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CheckInDto"]
  >(API.ATTENDANCE_STAFF_CHECK_IN, "post", {
    successMessage: "Checked in!",
    invalidateQueries: [{ key: staffAttendanceKeys.all }],
    mutationOptions: {},
  });
}

export function useCheckOut() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CheckOutDto"]
  >(API.ATTENDANCE_STAFF_CHECK_OUT, "post", {
    successMessage: "Checked out!",
    invalidateQueries: [{ key: staffAttendanceKeys.all }],
    mutationOptions: {},
  });
}

export function useFetchStaffAttendance() {
  return useFetchQuery<{ data: StaffAttendanceRecord[] }>(
    API.ATTENDANCE_STAFF,
    staffAttendanceKeys.all,
  );
}

export function useFetchStaffMemberAttendance(id: string) {
  return useFetchQuery<{ data: StaffAttendanceRecord }>(
    API.ATTENDANCE_STAFF_MEMBER(id),
    staffAttendanceKeys.member(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCorrectStaffAttendance(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ATTENDANCE_STAFF_CORRECT(id),
    "post",
    {
      successMessage: "Staff attendance corrected!",
      invalidateQueries: [{ key: staffAttendanceKeys.all }],
      mutationOptions: {},
    },
  );
}

export function useFetchPayrollSummary(branchId: string) {
  return useFetchQuery<{ data: PayrollSummary[] }>(
    API.ATTENDANCE_STAFF_PAYROLL(branchId),
    staffAttendanceKeys.payroll(branchId),
    undefined,
    { enabled: !!branchId },
  );
}
