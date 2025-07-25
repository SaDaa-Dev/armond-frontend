import { useWorkout } from "@/src/hooks/useWorkout";
import { useExercises, WorkoutMod, useSaveRoutine } from "@/src/hooks/useWorkoutQuery";
import {
    saveWorkoutRoutine,
    setShowWorkoutSession,
    setWorkoutMode,
    clearCheckedWorkouts
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
import SelectedWorkoutChips from "./SelectedWorkoutChips";

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
    mode: WorkoutMod;
    onWorkoutSelect?: (workouts: number[]) => void;
}

export default function CreateWorkoutSchedule({
    visible,
    onDismiss,
    mode,
    onWorkoutSelect,
}: CreateWorkoutScheduleProps) {
    const theme = useTheme();
    const translateX = useSharedValue(SCREEN_WIDTH);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "chest", "back", "shoulder", "biceps", "triceps", "abs", "legs", "fullbody",
    ]);
    const [routineName, setRoutineName] = useState("");
    const [routineDescription, setRoutineDescription] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const insets = useSafeAreaInsets();
    const { checkedWorkouts, isWorkoutSelected } = useWorkout();
    const dispatch = useDispatch();
    const { data: exercisesResponse } = useExercises();
    const saveRoutineMutation = useSaveRoutine();

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

    useEffect(() => {
        if (visible) {
            dispatch(setWorkoutMode(mode));
        }
    }, [visible, mode, dispatch]);

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

        if (mode === WorkoutMod.ROUTINE) { 
            // Routine Mode - 루틴 저장 다이얼로그 표시
            setShowSaveDialog(true);
        } else { 
            // Quick Mode - 운동 세션 시작
            if (onWorkoutSelect) {
                onWorkoutSelect(checkedWorkouts);
            }
            dispatch(setShowWorkoutSession(true));
            onDismiss();
        }
    };

    const handleSaveRoutine = async () => {
        if (!routineName.trim()) {
            Toast.show({
                type: "error",
                text1: "루틴 이름을 입력해주세요.",
            });
            return;
        }

        try {
            // 백엔드 API로 루틴 저장
            const response = await saveRoutineMutation.mutateAsync({
                name: routineName.trim(),
                description: routineDescription.trim(),
                exerciseIds: [...checkedWorkouts]
            });

            // 백엔드에서 반환된 ID와 함께 Redux 상태 업데이트
            dispatch(saveWorkoutRoutine({ 
                name: routineName.trim(),
                description: routineDescription.trim(),
                id: Date.now().toString() // 임시 ID 생성
            }));
            dispatch(clearCheckedWorkouts());
            
            // 상태 초기화
            setRoutineName("");
            setRoutineDescription("");
            setShowSaveDialog(false);
            
            Toast.show({
                type: "success",
                text1: "루틴이 저장되었습니다.",
            });
            onDismiss();
        } catch (error) {
            console.error('Failed to save routine:', error);
            Toast.show({
                type: "error",
                text1: "루틴 저장 실패",
                text2: "다시 시도해주세요.",
            });
        }
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
                        {mode === WorkoutMod.QUICK
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
                    {/* 카테고리 선택 영역 */}
                    <WorkoutCategories
                        selectedCategories={selectedCategories}
                        onCategoryPress={handleCategoryPress}
                    />

                    {/* 선택된 운동 목록 */}
                    <SelectedWorkoutChips 
                        checkedWorkouts={checkedWorkouts}
                        exercisesData={exercisesResponse}
                    />

                    {/* 운동 목록 */}
                    <WorkoutPresetList
                        selectedCategories={selectedCategories}
                    />

                    {/* 루틴 저장 다이얼로그 또는 액션 버튼 */}
                    {showSaveDialog ? (
                        <View style={styles.saveDialog}>
                            <TextInput
                                label="루틴 이름"
                                value={routineName}
                                onChangeText={setRoutineName}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="루틴 설명"
                                value={routineDescription}
                                onChangeText={setRoutineDescription}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                numberOfLines={3}
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
                            text={mode === WorkoutMod.QUICK ? "운동 시작" : "루틴 저장"}
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
    }
});
