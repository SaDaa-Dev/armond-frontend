import { useQuery } from '@tanstack/react-query';
import { workoutApi } from '../api/workoutApi';

export const QUERY_KEYS = {
    exercises: 'exercises',
    exercisesByCategory: 'exercisesByCategory',
    workoutRecords: 'workoutRecords',
} as const;

export function useExercises() {
    return useQuery({
        queryKey: [QUERY_KEYS.exercises],
        queryFn: workoutApi.getExercises,
    });
}
