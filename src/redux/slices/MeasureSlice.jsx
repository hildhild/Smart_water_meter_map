import { createSlice } from "@reduxjs/toolkit";

export const measureSlice = createSlice({
    name: "measure",
    initialState: {
        measure : false,
        distance: 0,
        path: []
    },
    reducers: {
        toggleMeasure: (state) => {
            if (state.measure) {
                state.measure = false;
            } else {
                state.measure = true;
            }
        },
        changeDistance: (state, action) => {
            state.distance = action.payload;
        },
        changePath: (state, action) => {
            state.path = action.payload;
        }
    }
});

export const { toggleMeasure, changeDistance, changePath } = measureSlice.actions

export default measureSlice.reducer;
