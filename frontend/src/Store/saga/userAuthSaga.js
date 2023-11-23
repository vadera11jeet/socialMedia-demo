import { put, takeLatest } from "redux-saga/effects";
import {
  signupStart,
  signupSuccess,
  signupFail,
  loginStart,
  loginSuccess,
  loginFail,
  logoutFail,
  logoutStart,
  logoutSuccess,
  forgotPasswordSuccess,
  forgotPasswordFail,
  forgotPasswordStart,
  validateTokenSuccess,
  validateTokenFail,
  validateTokenStart,
  resetPasswordFail,
  resetPasswordSuccess,
  resetPasswordStart,
} from "../slices/userAuthSlice";
import {
  signupApi,
  loginApi,
  logoutApi,
  forgotPasswordApi,
  validateForgotPasswordLinkApi,
  resetPasswordAPi,
} from "../../config/apiConfig";
import axiosInstance from "../../config/axiosConfig";

function* signupSaga(action) {
  try {
    const response = yield axiosInstance.post(signupApi, action.payload);
    yield put(signupSuccess(response.data));
  } catch (err) {
    yield put(signupFail(err.response.data.message));
  }
}

function* loginSaga(action) {
  try {
    const response = yield axiosInstance.post(loginApi, action.payload);
    yield put(loginSuccess(response.data.data.user));
  } catch (err) {
    yield put(loginFail(err.response.data.message));
  }
}

function* logoutSaga(action) {
  try {
    yield axiosInstance.get(logoutApi);
    yield put(logoutSuccess());
  } catch (err) {
    yield put(logoutFail(err.response.data.message));
  }
}

function* forgotPasswordSaga(action) {
  try {
    yield axiosInstance.post(forgotPasswordApi, action.payload);
    yield put(forgotPasswordSuccess());
  } catch (err) {
    yield put(forgotPasswordFail(err.message));
  }
}

function* forgotPasswordTokenValidationSaga(action) {
  try {
    const response = yield axiosInstance.get(
      `${validateForgotPasswordLinkApi}/${action.payload}`
    );
    yield put(validateTokenSuccess(response.data));
  } catch (err) {
    yield put(validateTokenFail(err.message));
  }
}

function* resetPasswordSaga(action) {
  try {
    yield axiosInstance.post(
      `${resetPasswordAPi}/${action.payload.token}`,
      action.payload.body
    );
    yield put(resetPasswordSuccess());
  } catch (err) {
    yield put(resetPasswordFail(err.message));
  }
}

export function* watchUserAuthSaga() {
  yield takeLatest(signupStart.type, signupSaga);
  yield takeLatest(loginStart.type, loginSaga);
  yield takeLatest(logoutStart.type, logoutSaga);
  yield takeLatest(forgotPasswordStart.type, forgotPasswordSaga);
  yield takeLatest(validateTokenStart.type, forgotPasswordTokenValidationSaga);
  yield takeLatest(resetPasswordStart.type, resetPasswordSaga);
}
