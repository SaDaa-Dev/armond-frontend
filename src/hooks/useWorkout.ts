import { RootState } from '@/src/store/configureStore';
import { useSelector } from 'react-redux';

export const useWorkout = () => {
    const checkedWorkouts = useSelector((state: RootState) => state.workout.checkedWorkout);
    const count = useSelector((state: RootState) => state.workout.count);
    const routines = useSelector((state: RootState) => state.workout.routines);
    const showWorkoutSession = useSelector((state: RootState) => state.workout.showWorkoutSession);

    return {
        checkedWorkouts,
        count,
        routines,
        showWorkoutSession,
        isWorkoutSelected: checkedWorkouts.length > 0
    };
}; 