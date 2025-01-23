import { configureStore } from "@reduxjs/toolkit";
import workoutSlice from "./features/workoutSlice";
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

export const store = configureStore({
    reducer: {
        workout: workoutSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
    devTools: __DEV__,
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer({ trace: true })),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
