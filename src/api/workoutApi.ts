import { BASE_URL } from "../constants/ApiConst";
import { components, operations } from './api-types';

type ExerciseListDto = components['schemas']['ExerciseListDto'];
type QuickWorkoutCompleteDto = components['schemas']['QuickWorkoutCompleteDto'];
type ApiResponseListExerciseListDto = components['schemas']['ApiResponseListExerciseListDto'];
type ApiResponseString = components['schemas']['ApiResponseString'];
type SaveRoutineDto = components['schemas']['SaveRoutineDto'];

export const workoutApi = {
    getExercisePresets: async (): Promise<ApiResponseListExerciseListDto> => {
        const response = await fetch(BASE_URL + '/exercises');
        return response.json();
    },
    
    saveRoutine: async (routineDto: SaveRoutineDto): Promise<ApiResponseString> => {
        const response = await fetch(`${BASE_URL}/routines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routineDto),
        });
        
        if (!response.ok) {
            throw new Error('Failed to save routine');
        }
        
        return response.json();
    },
    quickWorkoutComplete: async (dto: QuickWorkoutCompleteDto): Promise<ApiResponseString> => {
        const response = await fetch(`${BASE_URL}/workouts/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });
        
        if (!response.ok) {
            throw new Error('Failed to complete workout');
        }
        
        return response.json();
    },
};
