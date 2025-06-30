import { BASE_URL } from "../constants/ApiConst";
import { components, operations } from './api-types';
import { createApiClient } from "./axiosService";

type ExerciseListDto = components['schemas']['ExerciseListDto'];
type QuickWorkoutCompleteDto = components['schemas']['QuickWorkoutCompleteDto'];
type ApiResponseListExerciseListDto = components['schemas']['ApiResponseListExerciseListDto'];
type ApiResponseString = components['schemas']['ApiResponseString'];
type SaveRoutineDto = components['schemas']['SaveRoutineDto'];

const api = createApiClient();

export const workoutApi = {
    getExercisePresets: async (): Promise<ApiResponseListExerciseListDto> => {
        try {
            console.log("getExercisePresets");
            const response = await api.requestWithMethod(
                "GET",
                "/exercises"
            );
            return response.data;
        } catch (error) {
            throw new Error('운동 프리셋을 가져오는데 실패했습니다');
        }
    },
    
    saveRoutine: async (routineDto: SaveRoutineDto): Promise<ApiResponseString> => {
        try {
            const response = await api.requestWithMethod(
                "POST",
                "/routines",
                routineDto
            );
            return response.data;
        } catch (error) {
            throw new Error('루틴 저장에 실패했습니다');
        }
    },
    
    quickWorkoutComplete: async (dto: QuickWorkoutCompleteDto): Promise<ApiResponseString> => {
        try {
            const response = await api.requestWithMethod(
                "POST",
                "/workouts/complete",
                dto
            );
            return response.data;
        } catch (error) {
            throw new Error('운동 완료 처리에 실패했습니다');
        }
    },
};
