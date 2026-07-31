export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type SectionAttendanceEntry = {
  id?: string;
  studentId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  sex?: string;
  status: AttendanceStatus | null;
  note?: string;
};

export type SectionAttendanceSheet = {
  sectionId: string;
  date: string;
  entries: SectionAttendanceEntry[];
};

export type AttendanceStatistics = {
  branchId: string;
  gradeId: string;
  sectionId: string;
  dateFrom: string;
  dateTo: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
};

export type StaffAttendanceRecord = {
  id: string;
  branchId: string;
  profileId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PayrollSummary = {
  branchId: string;
  periodStart: string;
  periodEnd: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  staffCount: number;
};
