import { put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../config/axiosConfig";
import {
  createFeedApi,
  deleteFeedApi,
  feedByIdApi,
  getAllFeedApi,
  getUserFeedApi,
  updateFeedApi,
} from "../../config/apiConfig";
import {
  createdFeedStart,
  createdFeedFail,
  createdFeedSuccess,
  getAllFeedSuccess,
  getAllFeedFail,
  getAllFeedStart,
  getUserFeedFail,
  getUserFeedStart,
  getUserFeedSuccess,
  deleteFeedStart,
  deleteFeedSuccess,
  getFeedByIdSuccess,
  getFeedByIdFail,
  getFeedByIdStart,
  updateFeedSuccess,
  updateFeedFail,
  updateFeedStart,
} from "../slices/feedSlice";
import { deleteCommentFail } from "../slices/commentSlice";

function* createFeedSaga(action) {
  try {
    const response = yield axiosInstance.post(createFeedApi, action.payload);

    yield put(createdFeedSuccess(response.data));
  } catch (err) {
    yield put(createdFeedFail(err.message));
  }
}

function* getAllFeedsSaga(action) {
  try {
    const response = yield axiosInstance.get(getAllFeedApi, {
      params: {
        page: action.payload,
      },
    });
    yield put(getAllFeedSuccess(response.data));
  } catch (err) {
    yield put(getAllFeedFail(err.message));
  }
}

function* getUserFeedSaga(action) {
  try {
    const response = yield axiosInstance.get(
      `${getUserFeedApi}/${action.payload.userId}`,
      {
        params: {
          page: action.payload.pageSize,
        },
      }
    );
    yield put(getUserFeedSuccess(response.data));
  } catch (err) {
    yield put(getUserFeedFail(err.message));
  }
}

function* deleteFeedSaga(action) {
  try {
    yield axiosInstance.delete(`${deleteFeedApi}/${action.payload.feedId}`);
    yield put(deleteFeedSuccess(action.payload.feedId));
  } catch (err) {
    yield put(deleteCommentFail(err.message));
  }
}

function* getFeedByIdSaga(action) {
  try {
    const response = yield axiosInstance(
      `${feedByIdApi}/${action.payload.feedId}`
    );
    yield put(getFeedByIdSuccess(response.data.data));
  } catch (err) {
    yield put(getFeedByIdFail(err.message));
  }
}

function* updateFeedSaga(action) {
  try {
    const response = yield axiosInstance.patch(
      `${updateFeedApi}/${action.payload.feedId}`,
      action.payload.body
    );
    yield put(
      updateFeedSuccess({
        updatedData: response.data.data,
        feedId: action.payload.feedId,
      })
    );
  } catch (err) {
    yield put(updateFeedFail(err.message));
  }
}

export function* watchFeed() {
  yield takeLatest(createdFeedStart.type, createFeedSaga);
  yield takeLatest(getAllFeedStart.type, getAllFeedsSaga);
  yield takeLatest(getUserFeedStart.type, getUserFeedSaga);
  yield takeLatest(deleteFeedStart.type, deleteFeedSaga);
  yield takeLatest(getFeedByIdStart.type, getFeedByIdSaga);
  yield takeLatest(updateFeedStart.type, updateFeedSaga);
}
