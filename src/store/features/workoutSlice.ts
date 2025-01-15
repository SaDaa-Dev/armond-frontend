import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutState {
    count: number;
}

const initialState: WorkoutState = {
    count: 0,
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            state.count -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.count += action.payload;
        },
    },

});

export const { increment, decrement, incrementByAmount } = workoutSlice.actions;
export default workoutSlice.reducer; 