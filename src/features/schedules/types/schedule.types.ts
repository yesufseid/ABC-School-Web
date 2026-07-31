export type EventCategory =
  | "Academic"
  | "Examination"
  | "Holiday"
  | "Meeting"
  | "Sports"
  | "Training"
  | "Administration"
  | "Other";

export type CalendarEvent = {
  id: string;
  title: string;
  category: EventCategory;
  description?: string;
  startDate: string;
  endDate: string;
  branchIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type TimetableEntry = {
  id: string;
  sectionId: string;
  year: string;
  day: string;
  period: number;
  subjectId?: string;
  subjectName?: string;
  teacherId?: string;
  teacherName?: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Timetable = {
  sectionId: string;
  year: string;
  entries: TimetableEntry[];
};

export type TeacherLoad = {
  teacherId: string;
  teacherName?: string;
  sectionId: string;
  subjectId?: string;
  periods: number;
};
