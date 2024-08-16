import { combineReducers, configureStore } from '@reduxjs/toolkit';
import areaReducer from './slices/AreaSlice';
import mapReducer from './slices/MapSlice';
import measureReducer from './slices/MeasureSlice';


const rootReducer = combineReducers({ 
    area: areaReducer, 
    map: mapReducer,
    measure: measureReducer
})


export const store = configureStore({
    reducer: rootReducer,
});
