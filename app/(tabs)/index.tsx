import ExerciseContainer from "@/components/homeComponents/ExerciesContainer";
import HomeFooter from "@/components/homeComponents/HomeFooter";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function HomeScreen() {
    const theme = useTheme();

    return (
        <View
            style={[
                styles.homeContainer,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 통계 컴포넌트 */}
                {/* 캘린더 컴포넌트 */}
                <ExerciseContainer />
            </ScrollView>
            <HomeFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 2,
    },
});
