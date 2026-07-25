export type User = {
  name: string;
  phoneNumber: string;
  type: string;
  subscriptionEndDate?: string;
};

export type LoginResponse = {
  data: {
    accessToken: string;
    phoneNumber: string;
    name: string;
    type: string;
    subscriptionEndDate?: string;
  };
};
