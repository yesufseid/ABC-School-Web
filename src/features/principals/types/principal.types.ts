export type Principal = {
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
  isVicePrincipal: boolean;
  createdAt: string;
  updatedAt: string;
};
