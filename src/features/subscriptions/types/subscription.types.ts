export type Subscription = {
  id: string;
  name: string;
  months: number;
  price: number;
  active: boolean;
  features: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubscriptionInput = {
  name: string;
  months: number;
  price: number;
  active: boolean;
  features: Record<string, string | number | boolean>;
};

export type UpdateSubscriptionInput = Partial<CreateSubscriptionInput>;

export type SubscriptionSchoolEntry = {
  id: string;
  startDate: string;
  endDate: string;
  paidAmount: number;
  tenantId: string;
  tenantName: string;
  subscriptionId: string;
};

export type SubscriptionDetail = Subscription & {
  tenantSubscriptions: SubscriptionSchoolEntry[];
};
