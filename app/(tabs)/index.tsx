import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import DailyStastics from "../../components/homeComponents/DailyStastics";

export default function HomeScreen() {
    return (
        <>
            <SafeAreaView style={styles.container}>
                <DailyStastics />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 8, // 전체 화면의 여백
    },
});
