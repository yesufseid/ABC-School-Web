export type UserRole =
  | "Admin"
  | "Owner"
  | "Principal"
  | "VicePrincipal"
  | "Registrar"
  | "HR"
  | "Counselor"
  | "Staff"
  | "Parent"
  | "Teacher"
  | "Student";

export type User = {
  name: string;
  phoneNumber: string;
  type: UserRole;
  tenantId?: string;
  branchId?: string;
  subscriptionEndDate?: string;
};

export type LoginResponse = {
  data: {
    accessToken: string;
    phoneNumber: string;
    name: string;
    type: UserRole;
    subscriptionEndDate?: string;
  };
};
