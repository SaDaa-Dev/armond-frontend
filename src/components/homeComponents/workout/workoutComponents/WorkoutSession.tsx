import { useWorkout } from "@/src/hooks/useWorkout";
import { setShowWorkoutSession } from "@/src/store/features/workoutSlice";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    IconButton,
    Modal,
    Text,
    TextInput
} from "react-native-paper";
import { useDispatch } from "react-redux";
import CreateWorkoutSchedule from "../../CreateWorkoutSchedule";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface WorkoutSet {
    weight: string;
    reps: string;
    completed: boolean;
}

interface WorkoutExercise {
    id: number;
    title: string;
    sets: WorkoutSet[];
    isExpanded?: boolean;
}

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

export default function WorkoutSession() {
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [showAddWorkout, setShowAddWorkout] = useState(false);
    const { showWorkoutSession, checkedWorkouts } = useWorkout();
    const dispatch = useDispatch();

    const handleDismiss = () => {
        dispatch(setShowWorkoutSession(false));
    };

    useEffect(() => {
        if (checkedWorkouts.length > 0) {
            const initialExercises: WorkoutExercise[] = checkedWorkouts.map(
                (workoutId: number) => {
                    const workout = Object.values(WORKOUT_PRESETS)
                        .flat()
                        .find((w) => w.id === workoutId);

                    return {
                        id: workoutId,
                        title: workout?.title || "알 수 없는 운동",
                        sets: [{ weight: "", reps: "", completed: false }],
                        isExpanded: true,
                    };
                }
            );
            setExercises(initialExercises);
        }
    }, [checkedWorkouts]);

    // 새로운 운동 추가 처리
    const handleNewWorkouts = (newWorkouts: number[]) => {
        const existingIds = new Set(exercises.map((exercise) => exercise.id));
        const filteredNewWorkouts = newWorkouts.filter(
            (id) => !existingIds.has(id)
        );

        if (filteredNewWorkouts.length === 0) {
            return; // 모든 운동이 이미 추가되어 있음
        }

        const newExercises = filteredNewWorkouts.map((workoutId) => {
            const workout = Object.values(WORKOUT_PRESETS)
                .flat()
                .find((w) => w.id === workoutId);

            return {
                id: workoutId,
                title: workout?.title || "알 수 없는 운동",
                sets: [{ weight: "", reps: "", completed: false }],
                isExpanded: true,
            };
        });
        setExercises((prev) => [...prev, ...newExercises]);
    };

    // 접기/펼치기 토글
    const handleToggleExpand = (exerciseId: number) => {
        setExercises((prev) =>
            prev.map((exercise) => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        isExpanded: !exercise.isExpanded,
                    };
                }
                return exercise;
            })
        );
    };

    // 세트 추가
    const handleAddSet = (exerciseId: number) => {
        setExercises((prev) =>
            prev.map((exercise) => {
                if (exercise.id === exerciseId) {
                    return {
                        ...exercise,
                        sets: [
                            ...exercise.sets,
                            { weight: "", reps: "", completed: false },
                        ],
                    };
                }
                return exercise;
            })
        );
    };

    // 세트 완료 토글
    const handleToggleSet = (exerciseId: number, setIndex: number) => {
        setExercises((prev) =>
            prev.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const newSets = [...exercise.sets];
                    newSets[setIndex] = {
                        ...newSets[setIndex],
                        completed: !newSets[setIndex].completed,
                    };
                    return { ...exercise, sets: newSets };
                }
                return exercise;
            })
        );
    };

    // 운동 데이터 업데이트
    const handleUpdateSet = (
        exerciseId: number,
        setIndex: number,
        field: "weight" | "reps",
        value: string
    ) => {
        setExercises((prev) =>
            prev.map((exercise) => {
                if (exercise.id === exerciseId) {
                    const newSets = [...exercise.sets];
                    newSets[setIndex] = {
                        ...newSets[setIndex],
                        [field]: value,
                    };
                    return { ...exercise, sets: newSets };
                }
                return exercise;
            })
        );
    };

    return (
        <Modal
            visible={showWorkoutSession}
            onDismiss={handleDismiss}
            contentContainerStyle={[styles.modalContainer, { margin: 0 }]} 
            style={[styles.modal, { width: '100%', height: '100%' }]}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={styles.headerTitle}>
                        운동 세션
                    </Text>
                    <IconButton
                        icon="close"
                        onPress={handleDismiss}
                        style={styles.closeButton}
                    />
                </View>

                <ScrollView style={styles.scrollView}>
                    {exercises.map((exercise) => (
                        <Card key={exercise.id} style={styles.exerciseCard}>
                            <Card.Title
                                title={exercise.title}
                                right={(props) => (
                                    <IconButton
                                        {...props}
                                        icon={
                                            exercise.isExpanded
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        onPress={() =>
                                            handleToggleExpand(exercise.id)
                                        }
                                    />
                                )}
                            />
                            {exercise.isExpanded && (
                                <Card.Content>
                                    <View style={styles.setsHeader}>
                                        <Text style={styles.setLabel}>
                                            세트
                                        </Text>
                                        <Text style={styles.weightLabel}>
                                            무게(kg)
                                        </Text>
                                        <Text style={styles.repsLabel}>
                                            횟수
                                        </Text>
                                        <Text style={styles.completedLabel}>
                                            완료
                                        </Text>
                                    </View>
                                    {exercise.sets.map((set, index) => (
                                        <View key={index} style={styles.setRow}>
                                            <Text style={styles.setNumber}>
                                                {index + 1}
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                value={set.weight}
                                                onChangeText={(value) =>
                                                    handleUpdateSet(
                                                        exercise.id,
                                                        index,
                                                        "weight",
                                                        value
                                                    )
                                                }
                                                keyboardType="numeric"
                                                mode="outlined"
                                                dense
                                            />
                                            <TextInput
                                                style={styles.input}
                                                value={set.reps}
                                                onChangeText={(value) =>
                                                    handleUpdateSet(
                                                        exercise.id,
                                                        index,
                                                        "reps",
                                                        value
                                                    )
                                                }
                                                keyboardType="numeric"
                                                mode="outlined"
                                                dense
                                            />
                                            <IconButton
                                                icon={
                                                    set.completed
                                                        ? "check-circle"
                                                        : "circle-outline"
                                                }
                                                onPress={() =>
                                                    handleToggleSet(
                                                        exercise.id,
                                                        index
                                                    )
                                                }
                                                size={24}
                                            />
                                        </View>
                                    ))}
                                    <Button
                                        mode="text"
                                        icon="plus"
                                        onPress={() =>
                                            handleAddSet(exercise.id)
                                        }
                                        style={styles.addSetButton}
                                    >
                                        세트 추가
                                    </Button>
                                </Card.Content>
                            )}
                        </Card>
                    ))}
                    <Button
                        mode="outlined"
                        onPress={() => setShowAddWorkout(true)}
                        style={styles.addWorkoutButton}
                        icon="plus"
                    >
                        운동 추가하기
                    </Button>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={handleDismiss}
                        style={styles.completeButton}
                        icon="check"
                    >
                        운동 완료하기
                    </Button>
                </View>

                <CreateWorkoutSchedule
                    visible={showAddWorkout}
                    onDismiss={() => setShowAddWorkout(false)}
                    mode="quick"
                    onWorkoutSelect={handleNewWorkouts}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    modalContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        margin: 0,
    },
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        backgroundColor: "#1a1a1a",
    },
    headerTitle: {
        color: "#ffffff",
    },
    closeButton: {
        margin: 0,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    exerciseCard: {
        marginBottom: 16,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 12,
    },
    setsHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        marginBottom: 8,
    },
    setRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    setLabel: {
        flex: 1,
        color: "rgba(255, 255, 255, 0.7)",
    },
    weightLabel: {
        flex: 2,
        color: "rgba(255, 255, 255, 0.7)",
    },
    repsLabel: {
        flex: 2,
        color: "rgba(255, 255, 255, 0.7)",
    },
    completedLabel: {
        flex: 1,
        color: "rgba(255, 255, 255, 0.7)",
        textAlign: "center",
    },
    setNumber: {
        flex: 1,
        color: "rgba(255, 255, 255, 0.7)",
    },
    input: {
        flex: 2,
        marginHorizontal: 4,
        height: 40,
        backgroundColor: "transparent",
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    addWorkoutButton: {
        marginVertical: 16,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    completeButton: {
        backgroundColor: "#4CAF50",
    },
    addSetButton: {
        marginTop: 8,
        alignSelf: "flex-start",
    },
});
