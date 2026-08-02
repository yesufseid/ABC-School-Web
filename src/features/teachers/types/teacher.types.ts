export type TeacherGradeSubject = {
  id: string;
  name: string;
  subjectId: string;
};

export type TeacherGradeLink = {
  id: string;
  grade: string | null;
  gradeId: string;
  subjects: TeacherGradeSubject[];
};

export type Teacher = {
  id: string;
  branchId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  sex: "Male" | "Female";
  startingDate: string;
  weeklyPeriods: number;
  grades: TeacherGradeLink[];
  createdAt: string;
  updatedAt: string;
};

export type MySection = {
  sectionId: string;
  sectionName: string;
  grade: number;
  subjectId: string;
  subjectName: string;
  isHomeroom: boolean;
};

export type MyTeacher = Teacher & {
  sections: MySection[];
  summary: {
    mySections: number;
    myStudents: number;
    mySubjects: number;
    weeklyPeriods: number;
  };
};

export type MyStudent = {
  studentId: string;
  studentCode: string;
  studentName: string;
  sectionId: string;
  sectionName: string;
  grade: number;
  photoUrl?: string | null;
};

export type MyPeriod = {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId?: string;
  subjectName?: string;
  sectionId?: string;
  sectionName?: string;
  grade?: number;
  year?: string;
};

export type MyTimetableDay = {
  dayOfWeek: string;
  periods: MyPeriod[];
};
