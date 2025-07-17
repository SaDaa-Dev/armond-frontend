import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Button, useTheme, ActivityIndicator } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { getRadius, getShadow } from "@/utils/Theme";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "contained" | "outlined" | "text";

interface CustomButtonProps {
    onPress: () => void;
    text?: string;
    children?: React.ReactNode;
    mode?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: IconSource;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    contentStyle?: ViewStyle;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

export default function CustomButton({
    onPress,
    text,
    children,
    mode = "contained",
    size = "medium",
    disabled = false,
    loading = false,
    icon,
    iconPosition = "left",
    fullWidth = false,
    style,
    labelStyle,
    contentStyle,
    testID,
    accessibilityLabel,
    accessibilityHint,
}: CustomButtonProps) {
    const theme = useTheme();

    const buttonColor =
        mode === "contained" ? theme.colors.primary : "transparent";

    const textColor = (() => {
        switch (mode) {
            case "contained":
                return theme.colors.onPrimary;
            case "outlined":
                return theme.colors.primary;
            case "text":
                return theme.colors.primary;
            default:
                return theme.colors.primary;
        }
    })();

    const rippleColor =
        mode === "contained"
            ? theme.colors.onPrimary + "20"
            : theme.colors.primary + "20";

    const sizeStyles = getSizeStyles(size);
    const disabledStyles = getDisabledStyles(theme, mode, disabled);

    return (
        <Button
            mode={mode}
            style={[
                styles.button,
                sizeStyles.button,
                fullWidth && styles.fullWidth,
                mode === "outlined" && [
                    styles.outlinedButton,
                    {
                        borderColor: disabled
                            ? theme.colors.outline
                            : theme.colors.primary,
                    },
                ],
                mode === "contained" && [
                    styles.containedButton,
                    {
                        backgroundColor: disabled
                            ? theme.colors.surfaceVariant
                            : theme.colors.primary,
                    },
                ],
                mode === "text" && styles.textButton,
                disabledStyles.button,
                style,
            ]}
            labelStyle={[
                styles.buttonLabel,
                sizeStyles.label,
                { color: disabledStyles.textColor || textColor },
                labelStyle,
            ]}
            contentStyle={[
                styles.buttonContent,
                sizeStyles.content,
                contentStyle,
            ]}
            buttonColor={disabled ? theme.colors.surfaceVariant : buttonColor}
            textColor={disabledStyles.textColor || textColor}
            onPress={onPress}
            rippleColor={rippleColor}
            disabled={disabled || loading}
            icon={
                loading
                    ? () => (
                          <ActivityIndicator
                              size="small"
                              color={disabledStyles.textColor || textColor}
                          />
                      )
                    : icon
            }
            testID={testID}
            accessibilityLabel={accessibilityLabel || text}
            accessibilityHint={accessibilityHint}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
        >
            {children || text}
        </Button>
    );
}

function getSizeStyles(size: ButtonSize) {
    const sizeMap = {
        small: {
            button: { minHeight: 32 },
            content: { paddingVertical: 4, paddingHorizontal: 12 },
            label: { fontSize: 13, fontWeight: "500" as const },
        },
        medium: {
            button: { minHeight: 40 },
            content: { paddingVertical: 8, paddingHorizontal: 16 },
            label: { fontSize: 15, fontWeight: "600" as const },
        },
        large: {
            button: { minHeight: 48 },
            content: { paddingVertical: 12, paddingHorizontal: 20 },
            label: { fontSize: 16, fontWeight: "600" as const },
        },
    };

    return sizeMap[size];
}

function getDisabledStyles(theme: any, mode: ButtonVariant, disabled: boolean) {
    if (!disabled) {
        return {
            button: {},
            textColor: undefined,
        };
    }

    const getDisabledTextColor = () => {
        switch (mode) {
            case "contained":
                return theme.colors.onSurface + "60"; // 60% opacity
            case "outlined":
                return theme.colors.outline;
            case "text":
                return theme.colors.onSurface + "60"; // 60% opacity
            default:
                return theme.colors.onSurface + "60";
        }
    };

    return {
        button: {},
        textColor: getDisabledTextColor(),
    };
}

const styles = StyleSheet.create({
    button: {
        borderRadius: getRadius("md"),
        justifyContent: "center",
        elevation: 0,
        shadowColor: "transparent",
    },
    fullWidth: {
        flex: 1,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    containedButton: {
        ...getShadow("md"),
    },
    outlinedButton: {
        borderWidth: 1.5,
    },
    textButton: {
        backgroundColor: "transparent",
    },
    buttonLabel: {
        letterSpacing: 0.5,
        textTransform: "none",
        marginVertical: 0,
    },
});
