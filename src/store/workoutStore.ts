import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface WorkoutStore {    
    count: number;
    actions: {
        increment: () => void;
    }
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => {
    return{
        count : 0,
        actions : {
            increment: () => set({ count: get().count + 1 }),
        }
    }
});
