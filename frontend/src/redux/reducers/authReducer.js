import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../user/services/authServices";

// =========================================================
// 1. DEFINE ASYNC THUNKS (Actions)
// =========================================================

const handleAsyncError = (error, rejectWithValue) => {
  const errorMessage =
    error.response?.data?.message || error.message || "Something went wrong";
  return rejectWithValue({ message: errorMessage });
};

export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await authService.register(formData);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await authService.login(formData);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    return await authService.logout();
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getCurrentUser();
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getUserProfile();
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const updateUserProfile = createAsyncThunk("auth/updateUserProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.updateUserProfile(data);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const getAddresses = createAsyncThunk("auth/getAddresses", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getAddresses();
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const addAddress = createAsyncThunk("auth/addAddress", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.addAddress(data);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const updateAddress = createAsyncThunk("auth/updateAddress", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.updateAddress(data);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const deleteAddress = createAsyncThunk("auth/deleteAddress", async (id, { rejectWithValue }) => {
  try {
    const response = await authService.deleteAddress(id);
    return response.data;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

// =========================================================
// 2. STATE HANDLERS (Modular Logic)
// =========================================================

const setLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const setAuthSuccess = (state, action) => {
  state.loading = false;
  state.user = action.payload?.data || action.payload;
  state.isAuthenticated = true;
  state.success = true;
  state.error = null;
};

const setProfileSuccess = (state, action) => {
  state.loading = false;
  state.profile = action.payload?.data?.user || action.payload?.data || action.payload;
  state.success = true;
};

const setAddressSuccess = (state, action) => {
  state.loading = false;
  state.address = action.payload?.data?.address || action.payload?.data || action.payload;
  state.success = true;
};

const setAuthError = (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Authentication failed";
  // We only reset user if the error is from a core auth check
  if (action.type.includes("getCurrentUser") || action.type.includes("login")) {
    state.isAuthenticated = false;
    state.user = null;
  }
};

const handleLogout = (state) => {
  state.user = null;
  state.address = null;
  state.profile = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  state.success = false;
};

// =========================================================
// 3. SLICE DEFINITION
// =========================================================

const initialState = {
  user: null,
  address: null,
  profile: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, setAuthSuccess)
      
      // Profile
      .addCase(getUserProfile.pending, setLoading)
      .addCase(getUserProfile.fulfilled, setProfileSuccess)
      .addCase(updateUserProfile.fulfilled, setProfileSuccess)

      // Address Actions
      .addCase(getAddresses.pending, setLoading)
      .addCase(getAddresses.fulfilled, setAddressSuccess)
      .addCase(addAddress.fulfilled, setAddressSuccess)
      .addCase(updateAddress.fulfilled, setAddressSuccess)
      .addCase(deleteAddress.fulfilled, setAddressSuccess)

      // Logout
      .addCase(logoutUser.fulfilled, handleLogout)

      // Matchers
      .addMatcher(
        (action) => [loginUser.pending.type, registerUser.pending.type].includes(action.type),
        setLoading
      )
      .addMatcher(
        (action) => [loginUser.fulfilled.type, registerUser.fulfilled.type].includes(action.type),
        setAuthSuccess
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        setAuthError
      );
  },
});

export const { clearAuthErrors, resetSuccess } = authSlice.actions;
export default authSlice.reducer;