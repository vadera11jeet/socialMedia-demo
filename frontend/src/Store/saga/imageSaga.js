import { put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../config/axiosConfig";
import { deleteImageApi } from "../../config/apiConfig";
import {
  deleteImageFail,
  deleteImageStart,
  deleteImageSuccess,
} from "../slices/imageSlice";

function* imageDeleteSaga(action) {
  try {
    yield axiosInstance.delete(`${deleteImageApi}/${action.payload}`);
    yield put(deleteImageSuccess());
  } catch (err) {
    yield put(deleteImageFail(err.message));
  }
}

export function* watchImageSaga() {
  yield takeLatest(deleteImageStart.type, imageDeleteSaga);
}
