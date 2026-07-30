export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  sectionId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note: string | null;
};

export type StaffAttendanceRecord = {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
};

export type AttendanceStatistics = {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
};

export type PayrollSummary = {
  staffId: string;
  staffName: string;
  totalDays: number;
  totalHours: number;
  period: string;
};
