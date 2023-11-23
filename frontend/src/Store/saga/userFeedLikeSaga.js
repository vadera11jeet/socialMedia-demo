import { put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../config/axiosConfig";
import {
  feedLikeListApi,
  toggleLikeApi,
  userLikeListApi,
} from "../../config/apiConfig";
import {
  getFeedUserLikeListFail,
  getFeedUserLikeListStart,
  getFeedUserLikeListSuccess,
  getUserLikeListFail,
  getUserLikeListStart,
  getUserLikeListSuccess,
  toggleLikeFail,
  toggleLikeStart,
  toggleLikeSuccess,
} from "../slices/userFeedLikeSlice";

function* getUserLikeListSaga() {
  try {
    const response = yield axiosInstance.get(userLikeListApi);
    yield put(getUserLikeListSuccess(response.data.userLikedList));
  } catch (error) {
    yield put(getUserLikeListFail(error.response.data.message));
  }
}

function* toggleLike(action) {
  try {
    const response = yield axiosInstance.patch(
      `${toggleLikeApi}/${action.payload.feedId}`
    );
    yield put(toggleLikeSuccess(response.data));
    yield put(action.payload.cb({feedId: action.payload.feedId, Likes: response.data.userLikeList} ))
  } catch (err) {
    yield put(toggleLikeFail(err.response.data.message));
  }
}

function* feedUserLikeList(action) {
  try {
    const response = yield axiosInstance.get(
      `${feedLikeListApi}/${action.payload}`
    );
    yield put(getFeedUserLikeListSuccess(response.data.data));
  } catch (err) {
    yield put(getFeedUserLikeListFail(err.message));
  }
}

function* watchUserLikeList() {
  yield takeLatest(getUserLikeListStart.type, getUserLikeListSaga);
  yield takeLatest(toggleLikeStart.type, toggleLike);
  yield takeLatest(getFeedUserLikeListStart.type, feedUserLikeList);
}

export default watchUserLikeList;
