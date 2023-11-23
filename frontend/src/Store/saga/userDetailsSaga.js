import { put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../config/axiosConfig";
import { getAllUserApi } from "../../config/apiConfig";
import {
  getAllUserSuccess,
  getAllUserFail,
  getAllUserStart,
} from "../slices/userDetailsSlice";

function* getAllUserSaga() {
  try {
    const response = yield axiosInstance.get(getAllUserApi);
    yield put(getAllUserSuccess(response.data.data));
  } catch (e) {
    yield put(getAllUserFail(e.response.data.message));
  }
}

export function* watchUserDetails() {
  yield takeLatest(getAllUserStart.type, getAllUserSaga);
}
