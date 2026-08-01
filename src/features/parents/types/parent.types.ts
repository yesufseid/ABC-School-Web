import type { ParentRecord } from "@/features/registration/types/registration.types";

export type ParentListItem = ParentRecord & {
  _count: { students: number };
};

export type ParentStudentLink = {
  id: string;
  relation: "Father" | "Mother" | "Guardian" | "Other";
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    sex: "Male" | "Female";
    status: string;
    startingGrade: number;
    phone: string | null;
    createdAt: string;
  };
};

export type ParentDetail = ParentRecord & {
  students: ParentStudentLink[];
};
