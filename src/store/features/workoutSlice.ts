import { components } from '@/src/api/api-types';
import { WorkoutMod } from '@/src/hooks/useWorkoutQuery';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutRoutine {
    id: string;
    name: string;
    description: string;
    workouts: number[];
}
type ExerciseListDto = components['schemas']['ExerciseListDto'];


interface WorkoutState {
    checkedWorkout: number[];
    count: number;
    routines: WorkoutRoutine[];
    showWorkoutSession: boolean;
    exercises: ExerciseListDto[];
    isLoading: boolean; 
    error: string | null;
    activeWorkoutSession: {
        exercises: Array<{
            id: number;
            name: string;
            sets: Array<{
                weight: number;
                reps: number;
                completed: boolean;
            }>;
            isExpanded?: boolean;
        }> | null;
        isActive: boolean;
    } | null;
    workoutMode: WorkoutMod;
}

const initialState: WorkoutState = {
    checkedWorkout: [],
    count: 0,
    routines: [],
    showWorkoutSession: false,
    exercises: [],
    isLoading: false,
    error: null,
    activeWorkoutSession: null,
    workoutMode: WorkoutMod.QUICK,
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
        clearCheckedWorkouts: (state) => {
            state.checkedWorkout = [];
        },
        saveWorkoutRoutine: (state, action: PayloadAction<{ name: string; description: string; id?: string }>) => {
            const newRoutine: WorkoutRoutine = {
                id: action.payload.id || Date.now().toString(),
                name: action.payload.name,
                description: action.payload.description,
                workouts: [...state.checkedWorkout],
            };
            state.routines.push(newRoutine);
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
        setExercises: (state, action: PayloadAction<ExerciseListDto[]>) => {
            state.exercises = action.payload;
        },  
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setActiveWorkoutSession: (state, action) => {
            state.activeWorkoutSession = action.payload;
        },
        updateWorkoutSession: (state, action) => {
            if (state.activeWorkoutSession) {
                state.activeWorkoutSession.exercises = action.payload;
            }
        },
        setWorkoutMode: (state, action: PayloadAction<WorkoutMod>) => {
            state.workoutMode = action.payload;
        },
    },
});

export const { 
    increment, 
    decrement, 
    incrementByAmount, 
    addCheckedWorkout, 
    removeCheckedWorkout,
    clearCheckedWorkouts,
    saveWorkoutRoutine,
    deleteWorkoutRoutine,
    setShowWorkoutSession,
    setExercises,
    setLoading,
    setError,
    setActiveWorkoutSession,
    updateWorkoutSession,
    setWorkoutMode,
} = workoutSlice.actions;
export default workoutSlice.reducer; 