import { createSlice } from "@reduxjs/toolkit";

export const measureSlice = createSlice({
    name: "measure",
    initialState: {
        type: "Khoảng cách",
        measure : false,
        value: 0,
        path: [],
    },
    reducers: {
        toggleMeasure: (state) => {
            if (state.measure) {
                state.measure = false;
            } else {
                state.measure = true;
            }
        },
        changeValue: (state, action) => {
            state.value = action.payload;
        },
        changePath: (state, action) => {
            state.path = action.payload;
        },
        changeType: (state, action) => {
            state.type = action.payload;
        }
    }
});

export const { toggleMeasure, changeValue, changePath, changeType } = measureSlice.actions

export default measureSlice.reducer;
