import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import isEqual from "lodash.isequal";
import AuthService from "../../user/services/authServices";
import {
  AUTH_REGISTER,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_GET_CURRENT_USER,
  AUTH_GET_USER_PROFILE
} from "../utils/actionTypes.js";
// Reusable async thunk handler
const createAsyncAction = (type, serviceFunction) => {
  return createAsyncThunk(type, async (payload = null, { rejectWithValue }) => {
    try {
      const response = payload
        ? await serviceFunction(payload)
        : await serviceFunction();
      console.log(type, response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  });
};

// Define async actions
export const registerUser = createAsyncAction(
  AUTH_REGISTER,
  AuthService.register
);
export const loginUser = createAsyncAction(AUTH_LOGIN, AuthService.login);

// Logout User - Handled by AuthService
export const logoutUser = createAsyncAction(AUTH_LOGOUT, AuthService.logout);

// Get Current User - Handled by AuthService
export const getCurrentUser = createAsyncAction(
  AUTH_GET_CURRENT_USER,
  AuthService.getCurrentUser
);

// get user profile
export const getUserProfile = createAsyncAction(
  AUTH_GET_USER_PROFILE,
  AuthService.getUserProfile
);

// Update user profile
export const updateUserProfile = createAsyncAction(
  "AUTH_UPDATE_USER_PROFILE",
  AuthService.updateUserProfile
);

// Utility functions for state transitions
const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
};

const setErrorState = (state, action) => {
  state.loading = false;
  state.error = action.payload || "Something went wrong";
  state.success = false;
};

const setSuccessState = (state, action) => {
  const newUserData = action.payload?.data?.user;
  if (!isEqual(state.user, newUserData)) {
    state.user = newUserData;
  }
  state.loading = false;
  state.success = true;
  state.error = null;
};

const resetState = (state) => {
  state.loading = false;
  state.user = null;
  state.success = false;
  state.error = null;
};

// Initial state
const initialState = {
  user: null,
  loading: false,
  success: false,
  error: null
};

// Authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, setLoadingState)
      .addCase(registerUser.fulfilled, setSuccessState)
      .addCase(registerUser.rejected, setErrorState);

    builder
      .addCase(loginUser.pending, setLoadingState)
      .addCase(loginUser.fulfilled, setSuccessState)
      .addCase(loginUser.rejected, setErrorState);

    builder
      .addCase(logoutUser.pending, setLoadingState)
      .addCase(logoutUser.fulfilled, resetState)
      .addCase(logoutUser.rejected, setErrorState);

    builder
      .addCase(getCurrentUser.pending, setLoadingState)
      .addCase(getCurrentUser.fulfilled, setSuccessState)
      .addCase(getCurrentUser.rejected, setErrorState);
    builder
      .addCase(getUserProfile.pending, setLoadingState)
      .addCase(getUserProfile.fulfilled, setSuccessState)
      .addCase(getUserProfile.rejected, setErrorState);
    builder
      .addCase(updateUserProfile.pending, setLoadingState)
      .addCase(updateUserProfile.fulfilled, setSuccessState)
      .addCase(updateUserProfile.rejected, setErrorState);
  }
});

export default authSlice.reducer;
