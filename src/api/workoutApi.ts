import { BASE_URL } from "../constants/ApiConst";

export const workoutApi = {
    getExercisePresets: async () => {
        const response = await fetch(BASE_URL + '/exercises');
        return response.json();
    },
};
