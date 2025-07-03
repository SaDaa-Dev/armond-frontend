import WorkoutFooter from "@/src/components/homeComponents/WorkoutFooter";
import RoutineList from "@/src/components/homeComponents/WorkoutList";
import { useExercises } from "@/src/hooks/useWorkoutQuery";
import { setExercises } from "@/src/store/features/workoutSlice";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Button, Text } from "react-native-paper";
import { useDispatch } from "react-redux";
import { getSpacing, getShadow } from "@/utils/Theme";
import { useThemeContext } from "@/src/contexts/ThemeContext";

export default function HomeScreen() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { data: exercisePresets } = useExercises();
    const { themeMode, setThemeMode, isDark } = useThemeContext();

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
            {/* 테마 테스트 버튼들 */}
            <View style={styles.themeTestContainer}>
                <Text style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
                    🎨 테마 테스트: {themeMode} ({isDark ? '다크' : '라이트'})
                </Text>
                <View style={styles.themeButtons}>
                    <Button
                        mode="contained"
                        onPress={() => setThemeMode('light')}
                        style={styles.themeButton}
                    >
                        라이트
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => setThemeMode('dark')}
                        style={styles.themeButton}
                    >
                        다크
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => setThemeMode('system')}
                        style={styles.themeButton}
                    >
                        시스템
                    </Button>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={[
                    styles.scrollContent,
                    { backgroundColor: theme.colors.background }
                ]}
            >
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
    themeTestContainer: {
        padding: getSpacing('md'),
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // 눈에 띄는 배경
    },
    themeButtons: {
        flexDirection: 'row',
        gap: getSpacing('sm'),
    },
    themeButton: {
        flex: 1,
    },
    scrollContent: {
        padding: getSpacing('sm'),
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
