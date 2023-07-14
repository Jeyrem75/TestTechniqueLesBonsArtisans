import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        loading: false,
        error: false,
    },
    reducers: {
        fetchProductsStart: (state) => {
            state.loading = true;
        },
        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.products = action.payload;
        },
        fetchProductsFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        createProductStart: (state) => {
            state.loading = true;
        },
        createProductSuccess: (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
        },
        createProductFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        updateProductStart: (state) => {
            state.loading = true;
        },
        updateProductSuccess: (state, action) => {
            state.loading = false;
            state.products = state.products.map((product) =>
                product.id === action.payload.id ? action.payload : product
            );
        },
        updateProductFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        deleteProductStart: (state) => {
            state.loading = true;
        },
        deleteProductSuccess: (state, action) => {
            state.loading = false;
            state.products = state.products.filter((product) =>
                product.id !== action.payload
            );
        },
        deleteProductFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
    },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, createProductStart, createProductSuccess, createProductFailure, updateProductStart, updateProductSuccess, updateProductFailure, deleteProductStart, deleteProductSuccess, deleteProductFailure } = productsSlice.actions;
export default productsSlice.reducer;