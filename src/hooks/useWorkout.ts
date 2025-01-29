import { RootState } from '@/src/store/configureStore';
import { useSelector } from 'react-redux';

export const useWorkout = () => {
    const checkedWorkouts = useSelector((state: RootState) => state.workout.checkedWorkout);
    const count = useSelector((state: RootState) => state.workout.count);

    return {
        checkedWorkouts,
        count,
        isWorkoutSelected: checkedWorkouts.length > 0
    };
}; 