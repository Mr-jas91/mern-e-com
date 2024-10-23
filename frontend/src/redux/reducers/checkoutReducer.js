import { createSlice } from "@reduxjs/toolkit";

const checkoutReducer = createSlice({
  name: "checkout",
  initialState: {
    products: [],
  },
  reducers: {
    ADD_TO_CHECKOUT: (_, action) => ({
      products: action.payload,
    }),
    REMOVE_FROM_CHECKOUT: (state, action) => ({
      ...state,
      products: state.products.filter(
        (product) => product._id !== action.payload
      ),
    }),
    CLEAR_CHECKOUT: () => ({
      products: [],
    }),
  },
});

export const { ADD_TO_CHECKOUT, REMOVE_FROM_CHECKOUT, CLEAR_CHECKOUT } =
  checkoutReducer.actions;
export default checkoutReducer.reducer;
