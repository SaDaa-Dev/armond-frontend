import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutApi } from '../api/workoutApi';
import { components } from '../api/api-types';

type ExerciseListDto = components['schemas']['ExerciseListDto'];
type QuickWorkoutCompleteDto = components['schemas']['QuickWorkoutCompleteDto'];
type ApiResponseListExerciseListDto = components['schemas']['ApiResponseListExerciseListDto'];
type ApiResponseExerciseListDto = components['schemas']['ApiResponseExerciseListDto'];
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
    saveExercise: 'saveExercise',
} as const;

// 운동 목록 조회 - 캐시 최적화로 중복 호출 방지
export function useExercises() {
    return useQuery<ApiResponseListExerciseListDto>({
        queryKey: [QUERY_KEYS.exercisePresets],
        queryFn: workoutApi.getExercisePresets,
        staleTime: 30 * 60 * 1000, // 30분간 fresh 상태 유지
        gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 보관
        refetchOnMount: false, // 컴포넌트 마운트 시 캐시가 있으면 refetch 하지 않음
        refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 하지 않음
        refetchOnReconnect: true, // 네트워크 재연결 시에만 refetch
        retry: 3, // 실패 시 3번까지 재시도
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    });
}

// 운동 목록 캐시 무효화 훅 (커스텀 운동 등록 후 사용)
export function useInvalidateExercises() {
    const queryClient = useQueryClient();
    
    return () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.exercisePresets]
        });
    };
}

// 운동 목록 수동 갱신 훅 (필요한 경우에만 사용)
export function useRefreshExercises() {
    const queryClient = useQueryClient();
    
    return () => {
        queryClient.refetchQueries({
            queryKey: [QUERY_KEYS.exercisePresets]
        });
    };
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

// 커스텀 운동 저장 API 호출 (운동 목록 캐시 자동 무효화)
export const useSaveExercise = () => {
    const queryClient = useQueryClient();
    
    return useMutation<ApiResponseExerciseListDto, Error, ExerciseListDto>({
        mutationKey: [QUERY_KEYS.saveExercise],
        mutationFn: workoutApi.saveExercise,
        onSuccess: () => {
            // 커스텀 운동 저장 성공 시 운동 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.exercisePresets]
            });
        },
    });
};
