import { StyleSheet, View } from "react-native";
import ExerciseCard from "./ExerciseCard";

export default function ExerciseContainer() {
    // 종류 별 컴포넌트 2개 ex) 각 부위별 카드 1개씩 컨테이너로 구분
    return (
        <View style={styles.container}>
            <ExerciseCard />
            <ExerciseCard />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
    },
});
