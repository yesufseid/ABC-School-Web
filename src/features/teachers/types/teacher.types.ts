export type Teacher = {
  id: string;
  name: string;
  phoneNumber: string;
  branchId: string;
  subjectIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type TeacherGrade = {
  id: string;
  teacherId: string;
  gradeId: string;
  subjectId: string;
  createdAt: string;
};
