import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
    Chip,
    IconButton,
    List,
    Portal,
    Text,
    useTheme,
} from "react-native-paper";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CreateWorkoutScheduleProps {
    visible: boolean;
    onDismiss: () => void;
}

interface WorkoutCategory {
    id: string;
    label: string;
}

const WORKOUT_CATEGORIES: WorkoutCategory[] = [
    { id: "chest", label: "가슴" },
    { id: "back", label: "등" },
    { id: "arms", label: "팔" },
    { id: "shoulders", label: "어깨" },
    { id: "legs", label: "하체" },
];

const WORKOUT_PRESETS = {
    chest: [
        { id: 1, title: "벤치프레스", subtitle: "가슴 운동의 기본" },
        { id: 2, title: "인클라인 덤벨 프레스", subtitle: "상부 가슴 강화" },
        { id: 3, title: "딥스", subtitle: "하부 가슴과 삼두" },
        { id: 4, title: "벤치프레스", subtitle: "가슴 운동의 기본" },
        { id: 5, title: "인클라인 덤벨 프레스", subtitle: "상부 가슴 강화" },
        { id: 6, title: "딥스", subtitle: "하부 가슴과 삼두" },
    ],
    back: [
        { id: 7, title: "데드리프트", subtitle: "전신 운동" },
        { id: 8, title: "풀업", subtitle: "등근육 발달" },
    ],
};

export default function CreateWorkoutSchedule({
    visible,
    onDismiss,
}: CreateWorkoutScheduleProps) {
    const theme = useTheme();
    const translateX = useSharedValue(SCREEN_WIDTH);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "chest",
    ]);
    const insets = useSafeAreaInsets();

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

    const getFilteredWorkouts = () => {
        if (selectedCategories.length === 0) return [];

        return selectedCategories.flatMap(
            (category) =>
                WORKOUT_PRESETS[category as keyof typeof WORKOUT_PRESETS] || []
        );
    };

    return (
        <Portal>
            <Animated.View
                style={[
                    styles.container,
                    rBottomSheetStyle,
                    { 
                        backgroundColor: theme.colors.elevation.level2,
                        paddingTop: insets.top,     // 상단 안전 영역
                        paddingBottom: insets.bottom // 하단 안전 영역
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text
                        variant="headlineSmall"
                        style={{ color: theme.colors.onSurface }}
                    >
                        운동 선택
                    </Text>
                    <IconButton
                        icon="close"
                        size={15}
                        onPress={onDismiss}
                        iconColor={theme.colors.onSurface}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.chipContainer}>
                        {WORKOUT_CATEGORIES.map((category) => (
                            <Chip
                                key={category.id}
                                selected={selectedCategories.includes(
                                    category.id
                                )}
                                onPress={() => handleCategoryPress(category.id)}
                                style={[
                                    styles.chip,
                                    selectedCategories.includes(category.id) &&
                                        styles.selectedChip,
                                ]}
                                textStyle={[
                                    styles.chipText,
                                    selectedCategories.includes(category.id) &&
                                        styles.selectedChipText,
                                ]}
                                showSelectedCheck={false}
                            >
                                {category.label}
                            </Chip>
                        ))}
                    </View>

                    <ScrollView
                        style={styles.workoutList}
                        showsVerticalScrollIndicator={false}
                    >
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
                                        icon="dumbbell"
                                        color="#8A2BE2"
                                    />
                                )}
                                onPress={() =>
                                    console.log("Selected:", workout.title)
                                }
                                style={styles.listItem}
                                rippleColor="rgba(138, 43, 226, 0.1)"
                            />
                        ))}
                    </ScrollView>
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
    filterContainer: {
        marginBottom: 0,
    },
    chipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 30,
    },
    chip: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#8A2BE2",
        height: 32,
    },
    selectedChip: {
        backgroundColor: "#8A2BE2",
        borderColor: "#8A2BE2",
    },
    chipText: {
        fontSize: 14,
        color: "#8A2BE2",
    },
    selectedChipText: {
        color: "#FFFFFF",
    },
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
});
