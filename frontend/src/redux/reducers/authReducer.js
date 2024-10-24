import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../user/services/authServices.js";

// Register async thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Login async thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Logout async thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (accessToken, { rejectWithValue }) => {
    try {
      return await AuthService.logout(accessToken);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Get current user async thunk
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await AuthService.getCurrentUser(accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    addUser: (state, action) => {}
  },
  extraReducers: (builder) => {
    // Register reducer
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Login reducer
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Logout reducer
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
        state.success = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data.message;
        state.success = false;
      });

    // Get current user reducer
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
        state.success = true;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.success = false;
        state.loading = false;
      });
  }
});

export default authSlice.reducer;
