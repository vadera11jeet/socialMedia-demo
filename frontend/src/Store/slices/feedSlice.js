import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  feeds: [],
  currentUserFeedLoading: false,
  currentUserFeeds: [],
  currentUserFeedsError: null,
  creationLoading: false,
  createdFeed: null,
  createdFeedError: null,
  deleteFeedLoading: false,
  deleteFeedError: null,
  getFeedByIdLoading: false,
  getFeedByIdError: null,
  getFeedById: null,
  updateFeedLoading: false,
  updateFeedError: null,
  updateFeed: null,
  feedHasMore: true,
  userFeedHasMore: true,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    createdFeedStart: (state, action) => {
      state.creationLoading = true;
    },
    createdFeedSuccess: (state, action) => {
      state.creationLoading = false;
      state.createdFeed = action.payload.data;
      // state.feeds = [action.payload.data, ...state.feeds];
      state.currentUserFeedsError = null;
    },
    createdFeedFail: (state, action) => {
      state.creationLoading = false;
      state.createdFeedError = action.payload;
    },
    getAllFeedStart: (state, action) => {
      state.loading = true;
    },
    getAllFeedSuccess: (state, action) => {
      state.loading = false;
      state.feeds = [...state.feeds, ...action.payload.data];
      state.feedHasMore = action.payload.hasMore;
      state.error = null;
    },
    getAllFeedFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getUserFeedStart: (state, action) => {
      state.currentUserFeedLoading = true;
    },
    getUserFeedSuccess: (state, action) => {
      state.currentUserFeedLoading = false;
      state.currentUserFeedsError = null;
      state.currentUserFeeds = [
        ...state.currentUserFeeds,
        ...action.payload.data,
      ];
      state.userFeedHasMore = action.payload.hasMore;
      state.error = null;
    },
    getUserFeedFail: (state, action) => {
      state.currentUserFeedLoading = false;
      state.currentUserFeedsError = action.payload;
    },

    deleteFeedStart: (state, action) => {
      state.deleteFeedLoading = true;
    },
    deleteFeedSuccess: (state, action) => {
      state.deleteFeedLoading = false;
      state.deleteFeedError = null;
      state.currentUserFeeds = state.currentUserFeeds.filter(
        (feed) => feed.id !== action.payload
      );
    },
    deleteFeedFail: (state, action) => {
      state.deleteFeedLoading = false;
      state.deleteFeedError = action.payload;
    },
    getFeedByIdStart: (state, action) => {
      state.getFeedByIdLoading = true;
      state.getFeedByIdError = null;
    },
    getFeedByIdSuccess: (state, action) => {
      state.getFeedByIdLoading = false;
      state.getFeedById = action.payload;
    },
    getFeedByIdFail: (state, action) => {
      state.getFeedByIdLoading = false;
      state.getFeedByIdError = action.payload;
    },
    updateFeedImage: (state, action) => {
      state.getFeedById = { ...state.getFeedById, Images: action.payload };
    },

    feedLikeStatusUpdate: (state, action) => {
      state.feeds = state.feeds.map((feed, i) => {
        if (feed.id === action.payload.feedId) {
          feed.Likes = action.payload.Likes;
        }
        return feed;
      });
    },
    userFeedLikeStatusUpdate: (state, action) => {
      state.currentUserFeeds = state.currentUserFeeds.map((feed) => {
        if (feed.id === action.payload.feedId)
          feed.Likes = action.payload.Likes;
        return feed;
      });
    },
    feedCommentUpdate: (state, action) => {
      state.feeds = state.feeds.map((feed, i) => {
        feed.Comments =
          action.payload.feedId === feed.id
            ? action.payload.Comments
            : feed.Comments;
        return feed;
      });
    },
    feedUserCommentUpdate: (state, action) => {
      state.currentUserFeeds = state.feeds.map((feed) => {
        feed.Comments =
          action.payload.feedId === feed.id
            ? action.payload.Comments
            : feed.Comments;
        return feed;
      });
    },
    updateFeedStart: (state, action) => {
      state.updateFeedLoading = true;
    },
    updateFeedSuccess: (state, action) => {
      state.updateFeedLoading = false;
      state.updateFeed = action.payload.updatedData;
      state.currentUserFeeds = state.currentUserFeeds.map((feed) =>
        feed.id === action.payload.feedId ? action.payload.updatedData : feed
      );

      state.feeds = state.feeds.map((feed) =>
        feed.id === action.payload.feedId ? action.payload.updatedData : feed
      );
    },
    updateFeedFail: (state, action) => {
      state.updateFeedLoading = false;
      state.updateFeed = action.payload;
    },
    resetFeed: (state) => {
      state.getFeedById = null;
    },
    addNewFeed: (state, action) => {
      state.feeds = [action.payload, ...state.feeds]
    }
  },
});

export const {
  createdFeedStart,
  createdFeedSuccess,
  createdFeedFail,
  getAllFeedFail,
  getAllFeedStart,
  getAllFeedSuccess,
  getUserFeedStart,
  getUserFeedFail,
  getUserFeedSuccess,
  deleteFeedStart,
  deleteFeedFail,
  deleteFeedSuccess,
  feedLikeStatusUpdate,
  userFeedLikeStatusUpdate,
  feedCommentUpdate,
  feedUserCommentUpdate,
  getFeedByIdStart,
  getFeedByIdFail,
  getFeedByIdSuccess,
  updateFeedStart,
  updateFeedSuccess,
  updateFeedFail,
  resetFeed,
  updateFeedImage,
  addNewFeed
} = feedSlice.actions;

export default feedSlice.reducer;
