import { BASE_URL } from "../constants/ApiConst";
import { WorkoutCompleteDTO } from '../hooks/useWorkoutQuery';

export const workoutApi = {
    getExercisePresets: async () => {
        const response = await fetch(BASE_URL + '/exercises');
        return response.json();
    },
};

export const quickWorkoutCompleteApi = {
    quickWorkoutComplete: async (dto: WorkoutCompleteDTO) => {
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
