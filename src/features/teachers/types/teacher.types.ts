export type TeacherGradeLink = {
  gradeId: string;
  subjectIds: string[];
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
