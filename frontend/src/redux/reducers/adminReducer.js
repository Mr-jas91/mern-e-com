import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AdminServices from "../../admin/services/adminServices";
import {
  register_admin,
  login_admin,
  logout_admin,
  admin_profile,
  current_admin
} from "../utils/actionTypes";

const createAsyncAction = (type, serviceFunction) => {
  return createAsyncThunk(type, async (payload = null, { rejectWithValue }) => {
    try {
      const response = payload
        ? await serviceFunction(payload)
        : await serviceFunction();
      return response.data;
    } catch (error) {
      console.error(type, "error:", error?.response?.data || error.message);
      return rejectWithValue(error?.response?.data || error.message);
    }    
  });
};

export const registerAdmin = createAsyncAction(
  register_admin,
  AdminServices.register
);
export const loginAdmin = createAsyncAction(login_admin, AdminServices.login);
export const logout = createAsyncAction(logout_admin, AdminServices.logout);
export const adminProfile = createAsyncAction(
  admin_profile,
  AdminServices.adminProfile
);
export const currentAdmin = createAsyncAction(
  current_admin,
  AdminServices.getCurrentAdmin
);

const setSuccessState = (state, action) => {
  state.admin = action.payload?.data;
  state.loading = false;
  state.error = null;
  state.success = true;
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
  state.admin = null;
};

const setErrorState = (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.success = false;
  state.admin = null;
};

const setResetState = (state) => {
  state.loading = false;
  state.error = null;
  state.success = false;
  state.admin = null;
};

// Initial state
const initialState = {
  admin: null,
  loading: false,
  success: false,
  error: null
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
     .addCase(registerAdmin.pending, setLoadingState)
     .addCase(registerAdmin.fulfilled, setSuccessState)
     .addCase(registerAdmin.rejected, setErrorState)
     .addCase(loginAdmin.pending, setLoadingState)
     .addCase(loginAdmin.fulfilled, setSuccessState)
     .addCase(loginAdmin.rejected, setErrorState)
     .addCase(logout.fulfilled, setResetState)
     .addCase(adminProfile.pending, setLoadingState)
     .addCase(adminProfile.fulfilled, setSuccessState)
     .addCase(adminProfile.rejected, setErrorState)
     .addCase(currentAdmin.pending, setLoadingState)
     .addCase(currentAdmin.fulfilled, setSuccessState)
     .addCase(currentAdmin.rejected, setErrorState);
  }
});

export default adminSlice.reducer;
export const { resetAdminState } = adminSlice.actions;