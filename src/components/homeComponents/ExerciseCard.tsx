import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useWorkout } from "@/src/hooks/useWorkout";
import { useExercises } from "@/src/hooks/useWorkoutQuery";

interface Exercise {
    id: number;
    name: string;
    description: string;
    muscleCategories: string;
}

export default function ExerciseCard() {
    const theme = useTheme();
    const { checkedWorkouts } = useWorkout();
    const { data: exercisesResponse } = useExercises();

    const selectedExercises = exercisesResponse?.data.filter((exercise: Exercise) =>
        checkedWorkouts.includes(exercise.id)
    ) || [];

    if (selectedExercises.length === 0) {
        return null;
    }

    return (
        <Card
            style={[
                styles.card,
                { backgroundColor: theme.colors.elevation.level2 },
            ]}
        >
            <Card.Title
                title="선택된 운동"
                titleStyle={{ color: theme.colors.onSurface }}
            />
            <Card.Content>
                {selectedExercises.map((exercise: Exercise) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                        <Text
                            variant="bodyMedium"
                            style={[styles.exerciseName, { color: theme.colors.onSurface }]}
                        >
                            {exercise.name}
                        </Text>
                        <Text
                            variant="bodySmall"
                            style={[styles.exerciseDescription, { color: theme.colors.onSurfaceVariant }]}
                        >
                            {exercise.description}
                        </Text>
                    </View>
                ))}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 5,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    exerciseItem: {
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    exerciseName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    exerciseDescription: {
        opacity: 0.7,
    },
});
