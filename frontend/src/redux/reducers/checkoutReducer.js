import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    selectedItems: [], 
    shippingAddress: null,
    step: 0 // Checkout step (0: Cart, 1: Address, 2: Payment)
  },
  reducers: {
    addToCheckout: (state, action) => {
      state.selectedItems = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    resetCheckout: (state) => {
      state.selectedItems = [];
      state.shippingAddress = null;
      state.step = 0;
    }
  }
});

export const { addToCheckout, setShippingAddress, nextStep, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
