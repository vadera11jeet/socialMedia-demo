import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import { combineReducers } from "redux";
// eslint-disable-next-line
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import rootSaga from "./saga";
import feedSlice from "./slices/feedSlice";
import commentSlice from "./slices/commentSlice";
import userFeedLikeSlice from "./slices/userFeedLikeSlice";
import imageSlice from "./slices/imageSlice";
import utilSlice from "./slices/authSlice";
import authSlice from "./slices/userAuthSlice";
import userDetailsSlice from "./slices/userDetailsSlice";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = { key: "root", storage, version: 1 };

const rootReducer = combineReducers({
  auth: authSlice,
  util: utilSlice,
  userDetail: userDetailsSlice,
  feed: feedSlice,
  comment: commentSlice,
  like: userFeedLikeSlice,
  image: imageSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware: [...getDefaultMiddleware(), sagaMiddleware],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

