import { useMutation, useQuery } from '@tanstack/react-query';
import { quickWorkoutCompleteApi, workoutApi } from '../api/workoutApi';


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
    PLANNING = "PLANNING"
}

export const QUERY_KEYS = {
    exercisePresets: 'exercisePresets',
    exercisesByCategory: 'exercisesByCategory',
    workoutRecords: 'workoutRecords',
    quickWorkoutComplete: 'quickWorkoutComplete',
} as const;

// 운동 목록 조회
export function useExercises() {
    return useQuery({
        queryKey: [QUERY_KEYS.exercisePresets],
        queryFn: workoutApi.getExercisePresets,
    });
}

// 운동 완료 상태를 서버 저장 (Quick Mode)
export const useQuickWorkoutComplete = () => {
    return useMutation({
        mutationKey: [QUERY_KEYS.quickWorkoutComplete],
        mutationFn: (data: { workoutMode: WorkoutMod; exercises: WorkoutExercise[] }) => {
            // 여기서 프론트엔드 형식을 백엔드 DTO 형식으로 변환
            const exerciseRecords: ExerciseRecord[] = data.exercises.map((ex, index) => {
                return {
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
                };
            });

            const dto: WorkoutCompleteDTO = {
                exerciseRecords,
                workoutMod: data.workoutMode,
                isSave: true
            };

            return quickWorkoutCompleteApi.quickWorkoutComplete(dto);
        },
    });
};
