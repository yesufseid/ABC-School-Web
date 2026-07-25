import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  phoneNumber: string;
};

type AuthenticatedState = {
  accessToken: string;
  user: User;
};

type AuthInitialState =
  | AuthenticatedState
  | {
      accessToken: null;
      user: null;
    };

const initialState = {
  accessToken: null,
  user: null,
} as AuthInitialState;

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (_state, action: PayloadAction<AuthenticatedState>) => {
      return action.payload;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.accessToken = action.payload;
      }
    },

    updateUser: (state, action: PayloadAction<User>) => {
      if (state.accessToken) {
        state.user = action.payload;
      }
    },

    logout: () => initialState,
  },
});

export const { setCredentials, updateAccessToken, updateUser, logout } =
  authSlice.actions;

export default authSlice.reducer;
