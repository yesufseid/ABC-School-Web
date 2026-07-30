export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  branchId: string;
  sectionId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  name: string;
  gradeCycle: string;
  gradeLevel: string;
  branchId: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
};

export type Parent = {
  id: string;
  name: string;
  phoneNumber: string;
  studentIds: string[];
};
