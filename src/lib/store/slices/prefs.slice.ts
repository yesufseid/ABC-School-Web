import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type PrefsState = {
  branchId: string | null;
  year: string | null;
  term: string | null;
};

const initialState: PrefsState = {
  branchId: null,
  year: null,
  term: null,
};

export const prefsSlice = createSlice({
  name: "prefs",
  initialState,
  reducers: {
    setBranchId: (state, action: PayloadAction<string>) => {
      state.branchId = action.payload;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    setTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;
    },
  },
});

export const { setBranchId, setYear, setTerm } = prefsSlice.actions;

export default prefsSlice.reducer;
