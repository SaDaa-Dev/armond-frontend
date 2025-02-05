import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutRoutine {
    id: string;
    name: string;
    workouts: number[];
}

interface WorkoutState {
    checkedWorkout: number[];
    count: number;
    routines: WorkoutRoutine[];
    showWorkoutSession: boolean;
}

const initialState: WorkoutState = {
    checkedWorkout: [],
    count: 0,
    routines: [],
    showWorkoutSession: false,
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        setShowWorkoutSession: (state, action: PayloadAction<boolean>) => {
            state.showWorkoutSession = action.payload;
        },
        addCheckedWorkout: (state, action: PayloadAction<number>) => {
            state.checkedWorkout.push(action.payload);
        },
        removeCheckedWorkout: (state, action: PayloadAction<number>) => {
            state.checkedWorkout = state.checkedWorkout.filter(id => id !== action.payload);
        },
        saveWorkoutRoutine: (state, action: PayloadAction<{ name: string }>) => {
            const newRoutine: WorkoutRoutine = {
                id: Date.now().toString(),
                name: action.payload.name,
                workouts: [...state.checkedWorkout],
            };
            state.routines.push(newRoutine);
            state.checkedWorkout = []; // 저장 후 선택된 운동 초기화
        },
        deleteWorkoutRoutine: (state, action: PayloadAction<string>) => {
            state.routines = state.routines.filter(routine => routine.id !== action.payload);
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

export const { 
    increment, 
    decrement, 
    incrementByAmount, 
    addCheckedWorkout, 
    removeCheckedWorkout,
    saveWorkoutRoutine,
    deleteWorkoutRoutine,
    setShowWorkoutSession,
} = workoutSlice.actions;
export default workoutSlice.reducer; 