import { combineReducers, configureStore } from '@reduxjs/toolkit';
import areaReducer from './slices/AreaSlice';
import MapReducer from './slices/MapSlice';


const rootReducer = combineReducers({ 
    area: areaReducer, 
    map: MapReducer,
})


export const store = configureStore({
    reducer: rootReducer,
});
