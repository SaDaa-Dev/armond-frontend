import ExerciseContainer from "@/components/homeComponents/ExerciesContainer";
import HomeFooter from "@/components/homeComponents/HomeFooter";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* 통계 컴포넌트 */}
                    {/* 캘린더 컴포넌트 */}
                    <ExerciseContainer />
                </ScrollView>
                <HomeFooter />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 4,
    },
});
