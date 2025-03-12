import { useQuery } from '@tanstack/react-query';
import { workoutApi } from '../api/workoutApi';

export const QUERY_KEYS = {
    exercisePresets: 'exercisePresets',
    exercisesByCategory: 'exercisesByCategory',
    workoutRecords: 'workoutRecords',
} as const;

export function useExercises() {
    return useQuery({
        queryKey: [QUERY_KEYS.exercisePresets],
        queryFn: workoutApi.getExercisePresets,
    });
}
