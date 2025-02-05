import { useWorkout } from "@/src/hooks/useWorkout";
import {
    saveWorkoutRoutine,
    setShowWorkoutSession,
} from "@/src/store/features/workoutSlice";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
    Button,
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
        } else { 
            // Quick Mode
            if (onWorkoutSelect) {
                onWorkoutSelect(checkedWorkouts);
            }
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
                    <WorkoutCategories
                        selectedCategories={selectedCategories}
                        onCategoryPress={handleCategoryPress}
                    />
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
});
