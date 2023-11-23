import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  loading: false,
  userFeedLikeList: null,
  toggleLikeStatus: false,
  toggleLikeLoading: false,
  toggleLikeError: null,
  feedUserLikeListLoading: false,
  feedUserLikeList: null,
  feedUserLikeListError: null,
  totalLikeCount: null,
};

const userFeedLikeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    getUserLikeListStart: (state) => {
      state.loading = true;
    },
    getUserLikeListSuccess: (state, action) => {
      state.loading = false;
      state.userFeedLikeList = action.payload.map((value) => value.feedId);
    },
    getUserLikeListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleLikeStart: (state, action) => {
      state.toggleLikeLoading = true;
    },
    toggleLikeSuccess: (state, action) => {
      state.toggleLikeLoading = false;
      state.totalLikeCount = action.payload.likeCount;
      state.toggleLikeStatus = action.payload.isLiked;
      state.feedUserLikeList = action.payload.userLikeList;
    },
    toggleLikeFail: (state, action) => {
      state.toggleLikeLoading = false;
      state.toggleLikeError = action.payload;
    },
    getFeedUserLikeListStart: (state, action) => {
      state.feedUserLikeListLoading = true;
      state.feedUserLikeListError = null;
    },
    getFeedUserLikeListSuccess: (state, action) => {
      state.feedUserLikeListLoading = false;
      state.feedUserLikeList = action.payload;
    },
    getFeedUserLikeListFail: (state, action) => {
      state.feedUserLikeListLoading = false;
      state.feedUserLikeListError = action.payload;
    },
  },
});

export const {
  getUserLikeListFail,
  getUserLikeListStart,
  getUserLikeListSuccess,
  toggleLikeFail,
  toggleLikeStart,
  toggleLikeSuccess,
  getFeedUserLikeListFail,
  getFeedUserLikeListStart,
  getFeedUserLikeListSuccess,
} = userFeedLikeSlice.actions;

export default userFeedLikeSlice.reducer;
