import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { removeCheckedWorkout } from '@/src/store/features/workoutSlice';
import { Exercise } from '@/src/hooks/useWorkoutQuery';

interface SelectedWorkoutChipsProps {
    checkedWorkouts: number[];
    exercisesData: any; // API 응답 타입
}

const SelectedWorkoutChips = ({ checkedWorkouts, exercisesData }: SelectedWorkoutChipsProps) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    if (checkedWorkouts.length === 0) return null;

    return (
        <View style={styles.selectedWorkoutsContainer}>
            <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
                선택된 운동 ({checkedWorkouts.length})
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedWorkoutsList}
            >
                {checkedWorkouts.map((workoutId) => {
                    const workout = exercisesData?.data.find(
                        (exercise: Exercise) => exercise.id === workoutId
                    );
                    if (!workout) return null;

                    return (
                        <Chip
                            key={workout.id}
                            mode="outlined"
                            onClose={() => dispatch(removeCheckedWorkout(workout.id))}
                            style={styles.selectedWorkoutChip}
                            textStyle={{ color: theme.colors.onSurface }}
                        >
                            {workout.name}
                        </Chip>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    selectedWorkoutsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    selectedWorkoutsList: {
        flexGrow: 0,
    },
    selectedWorkoutChip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    }
});

export default SelectedWorkoutChips; 