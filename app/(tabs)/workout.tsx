import WorkoutFooter from "@/src/components/homeComponents/WorkoutFooter";
import RoutineList from "@/src/components/homeComponents/WorkoutList";
import { getSpacing } from "@/utils/Theme";
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
