import { put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../config/axiosConfig";
import { createCommentApi, deleteCommentApi } from "../../config/apiConfig";
import {
  createCommentFail,
  createCommentStart,
  createCommentSuccess,
  deleteCommentFail,
  deleteCommentStart,
  deleteCommentSuccess,
} from "../slices/commentSlice";

function* createCommentSaga(action) {
  try {
    const response = yield axiosInstance.post(
      `${createCommentApi}/${action.payload.feedId}`,
      action.payload.body
    );

    yield put(createCommentSuccess(response.data.data));
    yield put(
      action.payload.cb({
        feedId: action.payload.feedId,
        Comments: response.data.commentList,
      })
    );
  } catch (err) {
    yield put(createCommentFail(err.response.data.message));
  }
}

function* deleteCommentSaga(action) {
  try {
    const response = yield axiosInstance.delete(
      `${deleteCommentApi}/${action.payload.commentId}/${action.payload.feedId}`
    );

    yield put(deleteCommentSuccess());
    yield put(
      action.payload.cb({
        feedId: action.payload.feedId,
        Comments: response.data.commentList,
      })
    );
  } catch (err) {
    yield put(deleteCommentFail(err.message));
  }
}

function* watchComment() {
  yield takeLatest(createCommentStart.type, createCommentSaga);
  yield takeLatest(deleteCommentStart.type, deleteCommentSaga);
}

export default watchComment;
