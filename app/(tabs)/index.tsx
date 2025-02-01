import WorkoutFooter from "@/src/components/homeComponents/WorkoutFooter";
import WorkoutList from "@/src/components/homeComponents/WorkoutList";
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
                <WorkoutList />
            </ScrollView>
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
});
