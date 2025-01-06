import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import HomeFooterBtn from "./HomeFooterBtn";
import CreateWorkoutSheet from "./CreateWorkoutSchedule";
import { useState } from "react";

export default function HomeFooter() {
    const [sheetVisible, setSheetVisible] = useState(false);

    const handleWorkoutStart = () => {
        setSheetVisible(true);
    };

    return (
        <>
            <View style={styles.footer}>
                <HomeFooterBtn
                    text="운동 시작"
                    onPress={handleWorkoutStart}
                />
                <HomeFooterBtn
                    text="계획하기"
                    mode="outlined"
                    onPress={() => console.log("계획하기")}
                />
            </View>
            <CreateWorkoutSheet 
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
