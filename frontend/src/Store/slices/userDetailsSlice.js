import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  users: [],
  error: null,
};

const userDetailsSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {
    getAllUserStart: (state) => {
      state.loading = true;
    },
    getAllUserSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },
    getAllUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getAllUserStart, getAllUserFail, getAllUserSuccess } =
  userDetailsSlice.actions;
export default userDetailsSlice.reducer;
