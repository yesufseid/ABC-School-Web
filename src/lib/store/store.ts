import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import prefsReducer from "./slices/prefs.slice";
import { loadAuthState, rehydrateAuthState } from "./persist";

const persistedAuth = loadAuthState();
const preloadedState = persistedAuth
  ? { auth: rehydrateAuthState(persistedAuth) }
  : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    prefs: prefsReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
