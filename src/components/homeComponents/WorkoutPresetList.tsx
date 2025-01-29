import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addCheckedWorkout, removeCheckedWorkout } from '@/src/store/features/workoutSlice';
import { useWorkout } from '@/src/hooks/useWorkout';

const WORKOUT_PRESETS = {
    chest: [
        { id: 1, title: "벤치프레스", subtitle: "가슴 운동의 기본" },
        { id: 2, title: "인클라인 덤벨 프레스", subtitle: "상부 가슴 강화" },
        { id: 3, title: "딥스", subtitle: "하부 가슴과 삼두" },
    ],
    back: [
        { id: 7, title: "데드리프트", subtitle: "전신 운동" },
        { id: 8, title: "풀업", subtitle: "등근육 발달" },
    ],
};

interface WorkoutPresetListProps {
    selectedCategories: string[];
}

export default function WorkoutPresetList({ selectedCategories }: WorkoutPresetListProps) {
    const dispatch = useDispatch();
    const { checkedWorkouts } = useWorkout();

    const getFilteredWorkouts = () => {
        if (selectedCategories.length === 0) return [];
        return selectedCategories.flatMap(
            (category) => WORKOUT_PRESETS[category as keyof typeof WORKOUT_PRESETS] || []
        );
    };

    return (
        <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
            {getFilteredWorkouts().map((workout) => (
                <List.Item
                    key={workout.id}
                    title={workout.title}
                    titleStyle={styles.listItemTitle}
                    description={workout.subtitle}
                    descriptionStyle={styles.listItemDescription}
                    left={(props) => (
                        <List.Icon
                            {...props}
                            icon={checkedWorkouts.includes(workout.id) ? "check-circle" : "dumbbell"}
                            color={checkedWorkouts.includes(workout.id) ? "#4CAF50" : "#8A2BE2"}
                        />
                    )}
                    onPress={() => {
                        if(checkedWorkouts.includes(workout.id)) {
                            dispatch(removeCheckedWorkout(workout.id))
                        } else {
                            dispatch(addCheckedWorkout(workout.id))
                        }
                    }}
                    style={[
                        styles.listItem,
                        checkedWorkouts.includes(workout.id) && styles.checkedItem,
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