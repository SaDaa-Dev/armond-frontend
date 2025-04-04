import WorkoutFooter from "@/src/components/homeComponents/WorkoutFooter";
import RoutineList from "@/src/components/homeComponents/WorkoutList";
import { useExercises } from "@/src/hooks/useWorkoutQuery";
import { setExercises } from "@/src/store/features/workoutSlice";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { data: exercisePresets } = useExercises();

    useEffect(() => {
        if (exercisePresets?.data) {
            dispatch(setExercises(exercisePresets.data));
        }
    }, [exercisePresets]);

    return (
        <View
            style={[
                styles.homeContainer,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <RoutineList />
            </ScrollView>
            
            {/* Footer */}
            <WorkoutFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
