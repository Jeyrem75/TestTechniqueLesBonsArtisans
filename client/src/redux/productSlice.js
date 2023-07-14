import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "productDetail",
    initialState: {
        product: [],
        loading: false,
        error: false,
    },
    reducers: {
        fetchProductStart: (state) => {
            state.loading = true;
        },
        fetchProductSuccess: (state, action) => {
            state.loading = false;
            state.product = action.payload;
        },
        fetchProductFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const { fetchProductStart, fetchProductSuccess, fetchProductFailure } = productSlice.actions;
export default productSlice.reducer;