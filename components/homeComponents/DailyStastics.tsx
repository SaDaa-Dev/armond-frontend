import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Card, Text } from "react-native-paper";

export default function DailyStastics() {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 48) / 3;

    return (
        <View style={styles.container}>
            {/* 첫 세 개의 카드를 가로로 배치 */}
            <View style={styles.row}>
                <Card mode="outlined" style={styles.nutrientCard}>
                    <Card.Content>
                        <Text variant="titleSmall">탄수화물</Text>
                        <Text variant="bodyMedium">50g</Text>
                        <Text variant="bodyMedium">200kcal</Text>
                    </Card.Content>
                </Card>

                {/* 두 번째 카드 */}
                <Card mode="outlined" style={styles.nutrientCard}>
                    <Card.Content>
                        <Text variant="titleSmall">단백질</Text>
                        <Text variant="bodyMedium">2g</Text>
                        <Text variant="bodyMedium">20kcal</Text>
                    </Card.Content>
                </Card>

                {/* 세 번째 카드 */}
                <Card mode="outlined" style={styles.nutrientCard}>
                    <Card.Content>
                        <Text variant="titleSmall">지방</Text>
                        <Text variant="bodyMedium">3g</Text>
                        <Text variant="bodyMedium">30kcal</Text>
                    </Card.Content>
                </Card>
            </View>

            {/* 네 번째 카드를 전체 너비로 배치 */}
            <View style={styles.fullRow}>
                <Card mode="outlined" style={styles.caloriesCard}>
                    <Card.Content>
                        <Text variant="titleSmall">칼로리</Text>
                        <Text variant="bodyMedium">250kcal</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // 전체 화면을 채우도록 설정
        backgroundColor: "#FFFFFF",
    },
    row: {
        flexDirection: "row", // 가로 방향으로 배치
        justifyContent: "space-between", // 카드 간격을 동일하게 분배
        alignItems: "center",
    },
    nutrientCard: {
        flex: 1, // 카드가 동일한 크기로 분배
        margin: 8, // 카드 간격 설정
        backgroundColor: "#FFFFFF",
        borderRadius: 8, // 카드 모서리 둥글게
        borderColor: "#E0E0E0",
    },
    fullRow: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 8,
    },
    caloriesCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderColor: "#E0E0E0",
    },
});
