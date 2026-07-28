export type SchoolOwner = {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
};

export type School = {
  id: string;
  name: string;
  description: string;
  details: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  owner: SchoolOwner;
  subscriptionEndDate: string | null;
};

export type SchoolSubscription = {
  id: string;
  tenantId: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  paidAmount: number;
  subscription: {
    id: string;
    name: string;
    months: number;
    price: number;
  };
};

export type SchoolDetail = School & {
  members: Array<{
    id: string;
    userId: string;
    name: string;
    type: string;
    phoneNumber: string;
  }>;
  tenantSubscriptions: SchoolSubscription[];
};

export type Branch = {
  id: string;
  name: string;
  description: string;
  branchCode: string;
  branchPrefix: string;
  details: Record<string, string | number | boolean>;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBranchInput = {
  name: string;
  description: string;
  branchCode: string;
  branchPrefix: string;
  details: Record<string, string | number | boolean>;
};

export type UpdateBranchInput = Partial<CreateBranchInput>;

export type CreateSchoolInput = {
  ownerPhone: string;
  ownerName: string;
  password: string;
  name: string;
  description: string;
  details: Record<string, string | number | boolean>;
  branches?: CreateBranchInput[];
};

export type UpdateSchoolInput = Omit<CreateSchoolInput, "password" | "branches">;

export type SubscribeSchoolInput = {
  tenantId: string;
  subscriptionId: string;
  startDate: string;
  paidAmount: number;
};

export type DetailEntry = { key: string; value: string | number | boolean };
