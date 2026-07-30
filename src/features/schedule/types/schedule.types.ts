export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  sectionId: string;
  isActive: boolean;
};

export type TeacherLoad = {
  teacherId: string;
  teacherName: string;
  totalHours: number;
  entries: TimetableEntry[];
};
