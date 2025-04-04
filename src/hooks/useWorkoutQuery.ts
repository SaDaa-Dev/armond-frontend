import { useMutation, useQuery } from '@tanstack/react-query';
import { workoutApi } from '../api/workoutApi';
import { components } from '../api/api-types';

type ExerciseListDto = components['schemas']['ExerciseListDto'];
type QuickWorkoutCompleteDto = components['schemas']['QuickWorkoutCompleteDto'];
type ApiResponseListExerciseListDto = components['schemas']['ApiResponseListExerciseListDto'];
type ApiResponseString = components['schemas']['ApiResponseString'];
type SaveRoutineDto = components['schemas']['SaveRoutineDto'];

export interface WorkoutSet {
    weight: number;
    reps: number;
    completed: boolean;
}

export interface WorkoutExercise {
    id: number;
    name: string;
    sets: WorkoutSet[];
    isExpanded?: boolean;
}

export interface MuscleCategory {
    id: number;
    name: string;
    description: string;
    parent: string;
}

export interface Exercise {
    id: number;
    name: string;
    description: string;
    orderIdx: number;
    muscleCategories: MuscleCategory[];
}

export interface ExerciseSet {
    id?: number;
    setNumber: number;
    weight: number;
    reps: number;
    restTimeInSeconds: number;
}

export interface ExerciseRecord {
    id?: number;
    exercise: Exercise;
    sets: ExerciseSet[];
}

export interface WorkoutCompleteDTO {
    exerciseRecords: ExerciseRecord[];
    workoutMod: WorkoutMod;
    isSave: boolean;
}

export enum WorkoutMod {
    QUICK = "QUICK",
    ROUTINE = "ROUTINE"
}

export const QUERY_KEYS = {
    exercisePresets: 'exercisePresets',
    exercisesByCategory: 'exercisesByCategory',
    workoutRecords: 'workoutRecords',
    quickWorkoutComplete: 'quickWorkoutComplete',
    saveRoutine: 'saveRoutine',
} as const;

// 운동 목록 조회
export function useExercises() {
    return useQuery<ApiResponseListExerciseListDto>({
        queryKey: [QUERY_KEYS.exercisePresets],
        queryFn: workoutApi.getExercisePresets,
    });
}

// 운동 완료 상태를 서버 저장 (Quick Mode)
export const useQuickWorkoutComplete = () => {
    return useMutation<ApiResponseString, Error, { workoutMode: WorkoutMod; exercises: WorkoutExercise[] }>({
        mutationKey: [QUERY_KEYS.quickWorkoutComplete],
        mutationFn: (data) => {
            const exerciseRecords: QuickWorkoutCompleteDto['exerciseRecords'] = data.exercises.map((ex, index) => ({
                exercise: {
                    id: ex.id,
                    name: ex.name,
                    description: "",
                    orderIdx: index,
                    muscleCategories: []
                },
                sets: ex.sets.map((set, setIndex) => ({
                    setNumber: setIndex + 1,
                    weight: set.weight,
                    reps: set.reps,
                    restTimeInSeconds: 60 // 기본값
                }))
            }));

            const dto: QuickWorkoutCompleteDto = {
                exerciseRecords,
                workoutMod: data.workoutMode,
                isSave: true
            };

            return workoutApi.quickWorkoutComplete(dto);
        },
    });
};

// 루틴 저장 API 호출
export const useSaveRoutine = () => {
    return useMutation<ApiResponseString, Error, SaveRoutineDto>({
        mutationKey: [QUERY_KEYS.saveRoutine],
        mutationFn: (data) => {
            const routineDto = {
                name: data.name,
                description: data.description,
                exerciseIds: data.exerciseIds,
            };
            
            return workoutApi.saveRoutine(routineDto);
        },
    });
};
