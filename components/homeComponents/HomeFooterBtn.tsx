import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface HomeFooterBtnProps {
    onPress: () => void;
    text: string;
    mode?: "contained" | "outlined";
}

export default function HomeFooterBtn({ onPress, text, mode = "contained" }: HomeFooterBtnProps) {
    return (
        <Button
            mode={mode}
            style={[
                styles.button,
                mode === "outlined" && styles.outlinedButton
            ]}
            labelStyle={styles.buttonLabel}
            onPress={onPress}
        >
            {text}
        </Button>
    );  
}
    
const styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 24,
    },
    outlinedButton: {
        borderColor: '#9C27B0',  // 퍼플 테두리
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});