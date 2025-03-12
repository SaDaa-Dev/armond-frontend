import { RootState } from '@/src/store/configureStore';
import { useSelector } from 'react-redux';

export const useWorkout = () => {
    const checkedWorkouts = useSelector((state: RootState) => state.workout.checkedWorkout);
    const count = useSelector((state: RootState) => state.workout.count);
    const routines = useSelector((state: RootState) => state.workout.routines);
    const showWorkoutSession = useSelector((state: RootState) => state.workout.showWorkoutSession);
    const activeWorkoutSession = useSelector((state: RootState) => state.workout.activeWorkoutSession);

    return {
        checkedWorkouts,
        count,
        routines,
        showWorkoutSession,
        activeWorkoutSession,
        isWorkoutSelected: checkedWorkouts.length > 0,
    };
}; 