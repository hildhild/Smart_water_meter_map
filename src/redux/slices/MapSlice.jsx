import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: "map",
    initialState: {
        center : {
            lat: 10.762622, 
            lng: 106.660172
        },
        zoom: 10
    },
    reducers: {
        changeCenter: (state, action) => {
            state.center = action.payload;
        },
        changeZoom: (state, action) => {
            state.zoom = action.payload;
        }
    }
});

export const { changeCenter, changeZoom } = formSlice.actions

export default formSlice.reducer;
