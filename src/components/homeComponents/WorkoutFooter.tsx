import { useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomButton from "@/src/components/common/Button/CustomButton";
import CreateWorkoutSchedule from "./CreateWorkoutSchedule";
import { useWorkoutStore } from "@/src/store/workoutStore";

export default function WorkoutFooter() {
    const [sheetVisible, setSheetVisible] = useState(false);
    const { count, actions } = useWorkoutStore();

    return (
        <>
            <View style={styles.footer}>
                <CustomButton
                    text="운동 시작"
                    onPress={() => {
                        setSheetVisible(true);
                        actions.increment();
                    }}
                />
                <CustomButton
                    text="계획하기"
                    mode="outlined"
                    onPress={() => console.log("계획하기")}
                />
            </View>
            <CreateWorkoutSchedule   
                visible={sheetVisible} 
                onDismiss={() => setSheetVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 16,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
}); 