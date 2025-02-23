import { BASE_URL } from "../constants/ApiConst";

export const workoutApi = {
    getExercises: async () => {
        const response = await fetch(BASE_URL + '/exercises');
        return response.json();
    },
};
