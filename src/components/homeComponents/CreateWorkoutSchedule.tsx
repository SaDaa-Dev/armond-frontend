import { RootState } from "@/src/store/configureStore";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { IconButton, Portal, Text, useTheme } from "react-native-paper";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import StartWorkoutButton from "./StartWorkoutButton";
import WorkoutCategories from "./WorkoutCategories";
import WorkoutPresetList from "./WorkoutPresetList";
import { useWorkout } from "@/src/hooks/useWorkout";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CreateWorkoutScheduleProps {
    visible: boolean;
    onDismiss: () => void;
}

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
    const { checkedWorkouts, isWorkoutSelected } = useWorkout();

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
        // 선택한 운동 없으면 알림 띄우기
        if (!isWorkoutSelected) {
            Toast.show({
                type: "success",
                text1: "선택한 운동이 없습니다."
            });
            return;
        }
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
                    <WorkoutCategories
                        selectedCategories={selectedCategories}
                        onCategoryPress={handleCategoryPress}
                    />
                    <WorkoutPresetList
                        selectedCategories={selectedCategories}
                    />
                    <StartWorkoutButton onPress={handleStartWorkout} />
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
});
