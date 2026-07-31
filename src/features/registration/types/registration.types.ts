export type Parent = {
  id?: string;
  phoneNumber: string;
  name: string;
  sex: "Male" | "Female";
  address?: string;
  nationality?: string;
  relation?: "Father" | "Mother" | "Guardian" | "Other";
  isPrimary?: boolean;
  studentIds?: string[];
};

export type Student = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  startingGrade: number;
  enrollmentDate: string;
  admissionDate: string;
  sex: "Male" | "Female";
  address: string;
  nationality: string;
  previousSchool?: string;
  languagePreference?: string;
  phone?: string;
  parents: Parent[];
  branchId: string;
  sectionId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  name: string;
  year: string;
  capacity: number;
  gradeId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
};
