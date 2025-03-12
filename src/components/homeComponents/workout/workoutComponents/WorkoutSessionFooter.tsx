import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface WorkoutSessionFooterProps {
    handleCompleteWorkout: () => void;
    handleStopWorkout: () => void;
}

export default function WorkoutSessionFooter(
    { 
        handleCompleteWorkout, 
        handleStopWorkout 
    } : WorkoutSessionFooterProps
) {
    return (
        <View style={styles.footer}>
        <Button
            mode="contained"
            onPress={handleCompleteWorkout}
            style={[styles.completeButton, { flex: 1, marginRight: 8 }]}
            icon="check"
        >
            운동 완료하기
        </Button>
        <Button
            mode="contained"
            onPress={handleStopWorkout}
            style={styles.stopButton}
            icon="close"
        >
            종료
        </Button>
    </View>
    );
}


const styles = StyleSheet.create({  
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    completeButton: {
        backgroundColor: "#4CAF50",
    },
    stopButton: {
        backgroundColor: "#D32F2F",
    },
});
