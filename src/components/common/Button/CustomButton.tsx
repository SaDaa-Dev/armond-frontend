import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { getRadius, getShadow } from "@/utils/Theme";

interface CustomButtonProps {
    onPress: () => void;
    text: string;
    mode?: "contained" | "outlined";
}

export default function CustomButton({ onPress, text, mode = "contained" }: CustomButtonProps) {
    const theme = useTheme();
    
    const buttonColor = mode === "contained" ? theme.colors.primary : "transparent";
    const textColor = mode === "contained" 
        ? theme.colors.onPrimary 
        : theme.colors.primary;
    const rippleColor = mode === "contained" 
        ? theme.colors.onPrimary + "20" 
        : theme.colors.primary + "20";
    
    return (
        <Button
            mode={mode}
            style={[
                styles.button,
                mode === "outlined" && [
                    styles.outlinedButton,
                    { borderColor: theme.colors.primary }
                ],
                mode === "contained" && [
                    styles.containedButton,
                    { backgroundColor: theme.colors.primary }
                ],
            ]}
            labelStyle={[
                styles.buttonLabel,
                { color: textColor }
            ]}
            contentStyle={styles.buttonContent}
            buttonColor={buttonColor}
            textColor={textColor}
            onPress={onPress}
            rippleColor={rippleColor}
        >
            {text}
        </Button>
    );  
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: getRadius('md'),
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
        ...getShadow('md'),
    },
    outlinedButton: {
        borderWidth: 1.5,
    },
    buttonLabel: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 0.5,
        textTransform: 'none',
        marginVertical: 0,
    },
});   