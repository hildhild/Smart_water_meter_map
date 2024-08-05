import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: "area",
    initialState: {
        area : "TP Hồ Chí Minh"
    },
    reducers: {
        changeArea: (state, action) => {
            state.area = action.payload;
        }
    }
});

export const { changeArea } = formSlice.actions

export default formSlice.reducer;
