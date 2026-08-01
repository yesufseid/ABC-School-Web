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

export type ParentRecord = {
  id: string;
  parentId: string;
  name: string;
  sex: "Male" | "Female";
  address: string;
  nationality: string;
  phone: string;
  mustChangePassword: boolean;
  verifiedAt: string | null;
  userId: string;
  profileId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentParentLink = {
  id: string;
  relation: "Father" | "Mother" | "Guardian" | "Other";
  studentId: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  parent: ParentRecord;
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
  parents: StudentParentLink[];
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
