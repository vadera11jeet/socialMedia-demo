import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteImageLoading: false,
  deleteImageError: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    deleteImageStart: (state, action) => {
      state.deleteImageLoading = true;
    },
    deleteImageSuccess: (state, action) => {
      state.deleteImageLoading = false;
    },
    deleteImageFail: (state, action) => {
      state.deleteImageLoading = false;
      state.deleteImageError = action.payload;
    },
  },
});

export const { deleteImageStart, deleteImageSuccess, deleteImageFail } =
  imageSlice.actions;

export default imageSlice;
