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
