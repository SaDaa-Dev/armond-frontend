import CalorieDonutChart from "@/test/PieTest";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                {/* 첫 번째 카드 */}
                <Card mode="elevated" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleSmall">탄수화물</Text>
                    </Card.Content>
                </Card>

                {/* 두 번째 카드 */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleSmall">단백질</Text>
                        <Text variant="bodyMedium">2</Text>
                    </Card.Content>
                </Card>

                {/* 세 번째 카드 */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleSmall">지방</Text>
                        <Text variant="bodyMedium">3</Text>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16, // 전체 화면의 여백
    },
    row: {
        flexDirection: "row", // 가로로 배치
        justifyContent: "space-between", // 카드 간격 조정
        alignItems: "center",
    },
    card: {
        flex: 1, // 카드가 동일한 크기로 분배
        margin: 8, // 카드 간격 설정
        backgroundColor: "#FFFFFF",
    },
});
