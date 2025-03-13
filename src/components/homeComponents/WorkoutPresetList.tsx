import { useWorkout } from '@/src/hooks/useWorkout';
import { useExercises } from '@/src/hooks/useWorkoutQuery';
import { addCheckedWorkout, removeCheckedWorkout } from '@/src/store/features/workoutSlice';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { useDispatch } from 'react-redux';


interface WorkoutPresetListProps {
    selectedCategories: string[];
}

interface Exercise {
    id: number;
    name: string;
    description: string;
    muscleCategories: string;
}


export default function WorkoutPresetList({ selectedCategories }: WorkoutPresetListProps) {
    const dispatch = useDispatch();
    const { checkedWorkouts } = useWorkout();
    const { data: exercisesResponse } = useExercises();

    const getFilteredWorkouts = () => {
        if (!exercisesResponse?.data || selectedCategories.length === 0) return [];
        
        const categoryMapping: { [key: string]: string } = {
            'chest': 'Pectoralis',
            'back': 'Back',
            'arms': 'Arms',
            'shoulders': 'Shoulders',
            'legs': 'Lower Body',
            'core': 'Core'
        };

        return exercisesResponse.data.filter((exercise: Exercise) => {
            const exerciseCategories = exercise.muscleCategories.split(',');
            return selectedCategories.some(category => 
                exerciseCategories.includes(categoryMapping[category])
            );
        });
    };

    return (
        <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
            {getFilteredWorkouts().map((exercise : Exercise) => (
                <List.Item
                    key={exercise.id}
                    title={exercise.name}
                    titleStyle={styles.listItemTitle}
                    description={exercise.description}
                    descriptionStyle={styles.listItemDescription}
                    left={(props) => (
                        <List.Icon
                            {...props}
                            icon={checkedWorkouts.includes(exercise.id) ? "check-circle" : "dumbbell"}
                            color={checkedWorkouts.includes(exercise.id) ? "#4CAF50" : "#8A2BE2"}
                        />
                    )}
                    onPress={() => {
                        if(checkedWorkouts.includes(exercise.id)) {
                            dispatch(removeCheckedWorkout(exercise.id))
                        } else {
                            dispatch(addCheckedWorkout(exercise.id))
                        }
                    }}
                    style={[
                        styles.listItem,
                        checkedWorkouts.includes(exercise.id) && styles.checkedItem,
                    ]}
                    rippleColor="rgba(138, 43, 226, 0.1)"
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    workoutList: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    listItem: {
        borderRadius: 12,
        marginVertical: 6,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#8A2BE2",
        marginHorizontal: 4,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    listItemDescription: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.7)",
    },
    checkedItem: {
        backgroundColor: "rgba(76, 175, 80, 0.1)",
    },
}); 