import { useWorkout } from "@/src/hooks/useWorkout";
import { 
    setShowWorkoutSession, 
    setActiveWorkoutSession, 
    updateWorkoutSession,
    clearCheckedWorkouts 
} from "@/src/store/features/workoutSlice";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View, Animated } from "react-native";
import {
    Button,
    Card,
    IconButton,
    Portal,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";
import { useDispatch } from "react-redux";
import CreateWorkoutSchedule from "../../CreateWorkoutSchedule";
import { useExercises, useQuickWorkoutComplete } from "@/src/hooks/useWorkoutQuery";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WorkoutSessionFooter from "./WorkoutSessionFooter";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface WorkoutSet {
    weight: number;
    reps: number;
    completed: boolean;
}

interface WorkoutExercise {
    id: number;
    name: string;
    sets: WorkoutSet[]; 
    isExpanded?: boolean;
}

export default function WorkoutSession() {
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [showAddWorkout, setShowAddWorkout] = useState(false);
    const { showWorkoutSession, checkedWorkouts, activeWorkoutSession, workoutMode } = useWorkout();
    const { data: exercisesResponse } = useExercises();
    const quickWorkoutCompleteMutation = useQuickWorkoutComplete();
    const dispatch = useDispatch();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (showWorkoutSession) {
            // 화면을 올리는 애니메이션
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        } 
        else {
            // 화면을 내리는 애니메이션
            Animated.spring(slideAnim, {
                toValue: SCREEN_HEIGHT,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        }
    }, [showWorkoutSession]);

    useEffect(() => {
        if (checkedWorkouts.length > 0 && exercisesResponse?.data) {
            
            if (!activeWorkoutSession && showWorkoutSession) {
                const initialExercises: WorkoutExercise[] = checkedWorkouts.map(
                    (workoutId: number) => {
                        const workout = exercisesResponse.data.find((w: any) => w.id === workoutId);
                        
                        // 가능한 이름 속성 검사
                        const workoutName = workout?.name || workout?.exerciseName || workout?.title || workout?.exercise_name || "알 수 없는 운동";
    
                        return {
                            id: workoutId,
                            name: workoutName,
                            sets: [{ weight: 0, reps: 0, completed: false }],
                            isExpanded: true,
                        };
                    }
                );
                setExercises(initialExercises);
                dispatch(setActiveWorkoutSession({ exercises: initialExercises, isActive: true }));
            } else if (activeWorkoutSession?.exercises) {
                setExercises(activeWorkoutSession.exercises.map(exercise => ({
                    id: exercise.id,
                    name: exercise.name,
                    sets: exercise.sets,
                    isExpanded: exercise.isExpanded
                })));
            }
        }
    }, [checkedWorkouts, exercisesResponse, activeWorkoutSession, showWorkoutSession]);

    const handleDismiss = () => {
        dispatch(setShowWorkoutSession(false));
        dispatch(updateWorkoutSession(exercises));
        Animated.spring(slideAnim, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
            tension: 45,
            friction: 8
        }).start();
    };

    const handleCompleteWorkout = async () => {
        if (workoutMode === 'quick') {
            try {
                await quickWorkoutCompleteMutation.mutateAsync({
                    workoutMode,
                    exercises
                });
                // 성공적으로 저장된 후에 상태 초기화
                dispatch(setShowWorkoutSession(false));
                dispatch(updateWorkoutSession(exercises));
                dispatch(setActiveWorkoutSession(null));
                dispatch(clearCheckedWorkouts());
                
                Animated.spring(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    useNativeDriver: true,
                    tension: 45,
                    friction: 8
                }).start();
            } catch (error) {
                console.error('Failed to complete workout:', error);
            }
        } else {
            dispatch(setShowWorkoutSession(false));
            dispatch(updateWorkoutSession(exercises));
            dispatch(setActiveWorkoutSession(null));
            dispatch(clearCheckedWorkouts());
            
            Animated.spring(slideAnim, {
                toValue: SCREEN_HEIGHT,
                useNativeDriver: true,
                tension: 45,
                friction: 8
            }).start();
        }
    };

    const handleStopWorkout = () => {
        dispatch(setShowWorkoutSession(false));
        dispatch(setActiveWorkoutSession(null));
        dispatch(clearCheckedWorkouts());
        Animated.spring(slideAnim, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
            tension: 45,
            friction: 8
        }).start();
    };

    // 새로운 운동 추가 처리
    const handleNewWorkouts = (newWorkouts: number[]) => {
        if (!exercisesResponse?.data) return;

        const existingIds = new Set(exercises.map((exercise) => exercise.id));
        const filteredNewWorkouts = newWorkouts.filter(
            (id) => !existingIds.has(id)
        );

        if (filteredNewWorkouts.length === 0) {
            return; // 모든 운동이 이미 추가되어 있음
        }

        const newExercises = filteredNewWorkouts.map((workoutId) => {
            const workout = exercisesResponse.data.find((w: any) => w.id === workoutId);
            
            // 가능한 이름 속성 검사
            const workoutName = workout?.name || workout?.exerciseName || workout?.title || workout?.exercise_name || "알 수 없는 운동";

            return {
                id: workoutId,
                name: workoutName,
                sets: [{ weight: 0, reps: 0, completed: false }],
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
        const updatedExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: [
                        ...exercise.sets,
                        { weight: 0, reps: 0, completed: false },
                    ],
                };
            }
            return exercise;
        });
        
        setExercises(updatedExercises);
        dispatch(setActiveWorkoutSession({ 
            exercises: updatedExercises, 
            isActive: true 
        }));
    };

    // 세트 완료 토글
    const handleToggleSet = (exerciseId: number, setIndex: number) => {
        const updatedExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                const newSets = [...exercise.sets];
                newSets[setIndex] = {
                    ...newSets[setIndex],
                    completed: !newSets[setIndex].completed,
                };
                return { ...exercise, sets: newSets };
            }
            return exercise;
        });

        setExercises(updatedExercises);
        dispatch(setActiveWorkoutSession({ 
            exercises: updatedExercises, 
            isActive: true 
        }));
    };

    // 운동 데이터 업데이트
    const handleUpdateSet = (
        exerciseId: number,
        setIndex: number,
        field: "weight" | "reps",
        value: string
    ) => {
        const numericValue = value === "" ? 0 : parseFloat(value);
        if (isNaN(numericValue)) return;

        const updatedExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                const newSets = [...exercise.sets];
                newSets[setIndex] = {
                    ...newSets[setIndex],
                    [field]: numericValue,
                };
                return { ...exercise, sets: newSets };
            }
            return exercise;
        });

        setExercises(updatedExercises);
        dispatch(setActiveWorkoutSession({ 
            exercises: updatedExercises, 
            isActive: true 
        }));
    };


    return (
        <Portal>
            {showWorkoutSession && (
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <Animated.View 
                        style={[
                            styles.container, 
                            { 
                                paddingTop: insets.top,
                                transform: [{ translateY: slideAnim }] 
                            }
                        ]}
                    >
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
                                        title={`${exercise.name || '이름 없음'}`}
                                        titleStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
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
                                                        value={set.weight === 0 ? "" : set.weight.toString()}
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
                                                        value={set.reps === 0 ? "" : set.reps.toString()}
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

                        {/* Footer */}
                        <WorkoutSessionFooter 
                            handleCompleteWorkout={handleCompleteWorkout}
                            handleStopWorkout={handleStopWorkout}
                        />
                    
                        <CreateWorkoutSchedule
                            visible={showAddWorkout}
                            onDismiss={() => setShowAddWorkout(false)}
                            mode="quick"
                            onWorkoutSelect={handleNewWorkouts}
                        />
                    </Animated.View>
                </View>
            )}
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
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
        marginBottom: 8,
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
    addWorkoutButton: {
        marginVertical: 16,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    addSetButton: {
        marginTop: 8,
        alignSelf: "flex-start",
    },
});
