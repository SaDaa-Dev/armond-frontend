import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface CustomButtonProps {
    onPress: () => void;
    text: string;
    mode?: "contained" | "outlined";
}

export default function CustomButton({ onPress, text, mode = "contained" }: CustomButtonProps) {
    return (
        <Button
            mode={mode}
            style={[
                styles.button,
                mode === "outlined" && styles.outlinedButton,
                mode === "contained" && styles.containedButton,
            ]}
            labelStyle={[
                styles.buttonLabel,
                mode === "outlined" && styles.outlinedLabel
            ]}
            contentStyle={styles.buttonContent}
            buttonColor={mode === "contained" ? "#8A2BE2" : "transparent"}
            textColor={mode === "contained" ? "#FFFFFF" : "#8A2BE2"}
            onPress={onPress}
            rippleColor={mode === "contained" ? "rgba(255, 255, 255, 0.12)" : "rgba(138, 43, 226, 0.12)"}
        >
            {text}
        </Button>
    );  
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 12,
        minHeight: 48,
        justifyContent: 'center',
        elevation: 0,
        shadowColor: 'transparent',
    },
    buttonContent: {
        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    containedButton: {
        backgroundColor: '#8A2BE2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    outlinedButton: {
        borderColor: "#8A2BE2",
        borderWidth: 1.5,
    },
    buttonLabel: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 0.5,
        textTransform: 'none',
        marginVertical: 0,
    },
    outlinedLabel: {
        color: '#8A2BE2',
    },
});   