import { useWorkout } from "@/src/hooks/useWorkout";
import { deleteWorkoutRoutine } from "@/src/store/features/workoutSlice";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useDispatch } from "react-redux";

const WORKOUT_PRESETS = {   
    chest: [
        { id: 1, title: "벤치프레스", subtitle: "가슴 운동의 기본" },
        { id: 2, title: "인클라인 덤벨 프레스", subtitle: "상부 가슴 강화" },
        { id: 3, title: "딥스", subtitle: "하부 가슴과 삼두" },
    ],
    back: [
        { id: 4, title: "데드리프트", subtitle: "전신 운동" },
        { id: 5, title: "풀업", subtitle: "등근육 발달" },
    ],
};

export default function WorkoutList() {
    const dispatch = useDispatch();
    const { routines, showWorkoutSession } = useWorkout();

    const getWorkoutTitle = (workoutId: number) => {
        for (const category of Object.values(WORKOUT_PRESETS)) {
            const workout = category.find(w => w.id === workoutId);
            if (workout) return workout.title;
        }
        return '';
    };
    
    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
                내 운동 루틴
            </Text>
            {routines.map((routine) => (
                <Card key={routine.id} style={styles.card}>
                    <Card.Title
                        title={routine.name}
                        subtitle={`${routine.workouts.length}개의 운동`}
                        right={(props) => (
                            <IconButton
                                {...props}
                                icon="delete"
                                onPress={() => dispatch(deleteWorkoutRoutine(routine.id))}
                            />
                        )}
                    />
                    <Card.Content>
                        {routine.workouts.map((workoutId, index) => (
                            <Text key={workoutId} style={styles.workoutItem}>
                                {index + 1}. {getWorkoutTitle(workoutId)}
                            </Text>
                        ))}
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 16,
        color: '#FFFFFF',
    },
    card: {
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
    },
    workoutItem: {
        color: 'rgba(255, 255, 255, 0.7)',
        marginVertical: 4,
    },
});   