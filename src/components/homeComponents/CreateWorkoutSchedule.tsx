import { useWorkout } from "@/src/hooks/useWorkout";
import {
    saveWorkoutRoutine,
    setShowWorkoutSession,
    removeCheckedWorkout,
    clearCheckedWorkouts,
    setActiveWorkoutSession,
    setWorkoutMode,
} from "@/src/store/features/workoutSlice";
import { useExercises } from "@/src/hooks/useWorkoutQuery";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, ScrollView } from "react-native";
import {
    Button,
    Chip,
    IconButton,
    Portal,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import StartWorkoutButton from "./StartWorkoutButton";
import WorkoutCategories from "./WorkoutCategories";
import WorkoutPresetList from "./WorkoutPresetList";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Exercise {
    id: number;
    name: string;
    description: string;
    muscleCategories: string;
}

interface CreateWorkoutScheduleProps {
    visible: boolean;
    onDismiss: () => void;
    mode?: "quick" | "planning";
    onWorkoutSelect?: (workouts: number[]) => void;
}

export default function CreateWorkoutSchedule({
    visible,
    onDismiss,
    mode = "planning",
    onWorkoutSelect,
}: CreateWorkoutScheduleProps) {
    const theme = useTheme();
    const translateX = useSharedValue(SCREEN_WIDTH);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "chest",
        "back",
        "shoulder",
        "biceps",
        "triceps",
        "abs",
        "legs",
        "fullbody",
    ]);
    const [routineName, setRoutineName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const insets = useSafeAreaInsets();
    const { checkedWorkouts, isWorkoutSelected } = useWorkout();
    const dispatch = useDispatch();
    const { data: exercisesResponse } = useExercises();

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    useEffect(() => {
        if (visible) {
            translateX.value = withSpring(0, {
                damping: 50,
                stiffness: 300,
            });
        } else {
            translateX.value = withSpring(SCREEN_WIDTH, {
                damping: 50,
                stiffness: 300,
            });
        }
    }, [visible]);

    const handleCategoryPress = (categoryId: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleStartWorkout = () => {
        if (!isWorkoutSelected) {
            Toast.show({
                type: "error",
                text1: "선택한 운동이 없습니다.",
            });
            return;
        }

        if (mode === "planning") { 
            // Planning Mode
            setShowSaveDialog(true);
            dispatch(setWorkoutMode('planning'));
        } else { 
            // Quick Mode
            if (onWorkoutSelect) {
                onWorkoutSelect(checkedWorkouts);
            }

            // 선택된 운동들로 초기 세션 생성
            const initialExercises = checkedWorkouts.map((workoutId) => {
                const workout = exercisesResponse?.data.find((w: Exercise) => w.id === workoutId);
                return {
                    id: workoutId,
                    name: workout?.name || "알 수 없는 운동",
                    sets: [{ weight: "", reps: "", completed: false }],
                    isExpanded: true,
                };
            });

            dispatch(setActiveWorkoutSession({ exercises: initialExercises, isActive: true }));
            dispatch(setWorkoutMode('quick'));
            dispatch(setShowWorkoutSession(true));
            onDismiss();
        }
    };

    const handleSaveRoutine = () => {
        if (!routineName.trim()) {
            Toast.show({
                type: "error",
                text1: "루틴 이름을 입력해주세요.",
            });
            return;
        }

        dispatch(saveWorkoutRoutine({ name: routineName.trim() }));
        setRoutineName("");
        setShowSaveDialog(false);
        Toast.show({
            type: "success",
            text1: "루틴이 저장되었습니다.",
        });
        onDismiss();
    };

    return (
        <Portal>
            <Animated.View
                style={[
                    styles.container,
                    rBottomSheetStyle,
                    {
                        backgroundColor: theme.colors.elevation.level2,
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text
                        variant="headlineSmall"
                        style={{ color: theme.colors.onSurface }}
                    >
                        {mode === "quick"
                            ? "빠른 운동 시작"
                            : "운동 루틴 만들기"}
                    </Text>
                    <IconButton
                        icon="close"
                        size={15}
                        onPress={onDismiss}
                        iconColor={theme.colors.onSurface}
                    />
                </View>

                <View style={styles.contentContainer}>
                    {/* 운동 카테고리 컴포넌트 */}
                    <WorkoutCategories
                        selectedCategories={selectedCategories}
                        onCategoryPress={handleCategoryPress}
                    />

                    {/* 선택된 운동 목록 컴포넌트 */}
                    {checkedWorkouts.length > 0 && (    
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
                                    const workout = exercisesResponse?.data.find(
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
                    )}

                    <WorkoutPresetList
                        selectedCategories={selectedCategories}
                    />

                    {showSaveDialog ? (
                        <View style={styles.saveDialog}>
                            <TextInput
                                label="루틴 이름"
                                value={routineName}
                                onChangeText={setRoutineName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <View style={styles.dialogButtons}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setShowSaveDialog(false)}
                                    style={styles.dialogButton}
                                >
                                    취소
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleSaveRoutine}
                                    style={styles.dialogButton}
                                >
                                    저장
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <StartWorkoutButton
                            onPress={handleStartWorkout}
                            text={mode === "quick" ? "운동 시작" : "루틴 저장"}
                        />
                    )}
                </View>
            </Animated.View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: "absolute",
        right: 0,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
    },
    contentContainer: {
        flex: 1,
    },
    saveDialog: {
        padding: 16,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 12,
        margin: 16,
    },
    input: {
        marginBottom: 16,
    },
    dialogButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    dialogButton: {
        minWidth: 100,
    },
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
    },
});
