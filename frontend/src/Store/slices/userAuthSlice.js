import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isUserLoggedIn: false,
  loading: false,
  error: null,
  forgotPasswordLoading: false,
  mailMessageForgotPassword: null,
  forgotPasswordError: null,
  validateTokenLoading: false,
  forgotTokenValid: null,
  validateTokenError: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.user = action.payload;
    },
    signupFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isUserLoggedIn = true;
      state.error = null;
      state.user = action.payload;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = null;
      state.isUserLoggedIn = false;
      state.user = null;
    },
    logoutFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    forgotPasswordStart: (state, action) => {
      state.forgotPasswordError = null;
      state.resetPasswordSuccess = false;
      state.forgotPasswordLoading = true;
    },
    forgotPasswordSuccess: (state, action) => {
      state.forgotPasswordLoading = false;
    },
    forgotPasswordFail: (state, action) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = action.payload;
    },
    resetPasswordStart: (state, action) => {
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
      state.resetPasswordLoading = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = true;
    },
    resetPasswordFail: (state, action) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = action.payload;
    },
    validateTokenStart: (state, action) => {
      state.validateTokenError = null;
      state.resetPasswordSuccess = false;
      state.validateTokenLoading = true;
    },
    validateTokenSuccess: (state, action) => {
      state.validateTokenLoading = false;
      state.forgotTokenValid = action.payload;
    },
    validateTokenFail: (state, action) => {
      state.validateTokenLoading = false;
      state.validateTokenError = action.payload;
    },
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFail,
  loginStart,
  loginSuccess,
  loginFail,
  logoutFail,
  logoutStart,
  logoutSuccess,
  forgotPasswordStart,
  forgotPasswordFail,
  forgotPasswordSuccess,
  resetPasswordFail,
  resetPasswordStart,
  resetPasswordSuccess,
  validateTokenFail,
  validateTokenStart,
  validateTokenSuccess,
} = userAuthSlice.actions;
export default userAuthSlice.reducer;
