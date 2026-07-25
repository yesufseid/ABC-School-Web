export type User = {
  name: string;
  phoneNumber: string;
  type: "Owner";
  subscriptionEndDate?: string;
};

export type LoginResponse = {
  data: {
    accessToken: string;
    phoneNumber: string;
    name: string;
    type: "Owner";
    subscriptionEndDate?: string;
  };
};
