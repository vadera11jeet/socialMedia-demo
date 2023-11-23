import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isCommentSuccess: false,
  deleteCommentLoading: false,
  deleteCommentError: null,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    createCommentStart: (state, action) => {
      state.loading = true;
    },
    createCommentSuccess: (state, action) => {
      state.loading = false;
      state.isCommentSuccess = true;
      state.error = null;
    },
    createCommentFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCommentStart: (state, action) => {
      state.deleteCommentLoading = true;
    },
    deleteCommentSuccess: (state) => {
      state.deleteCommentLoading = false;
      state.deleteCommentError = null;
    },
    deleteCommentFail: (state, action) => {
      state.deleteCommentLoading = false;
      state.deleteCommentError = action.payload;
    },
  },
});

export const {
  createCommentFail,
  createCommentStart,
  createCommentSuccess,
  deleteCommentStart,
  deleteCommentFail,
  deleteCommentSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;
