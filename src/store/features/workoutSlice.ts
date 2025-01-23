import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutState {
    checkedWorkout: number[];
    count: number;
}

const initialState: WorkoutState = {
    checkedWorkout: [],
    count: 0,
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        addCheckedWorkout: (state, action: PayloadAction<number>) => {
            state.checkedWorkout.push(action.payload);
        },
        removeCheckedWorkout: (state, action: PayloadAction<number>) => {
            state.checkedWorkout = state.checkedWorkout.filter(id => id !== action.payload);
        },
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