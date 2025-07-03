import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { Colors, ThemeConstants } from "./Colors";

// 커스텀 라이트 테마
export const CustomLightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: Colors.light.primary,
        primaryContainer: Colors.light.accent,
        secondary: Colors.light.secondary,
        secondaryContainer: Colors.light.muted,
        tertiary: Colors.light.accentForeground,
        surface: Colors.light.background,
        surfaceVariant: Colors.light.card,
        background: Colors.light.background,
        error: Colors.light.destructive,
        errorContainer: Colors.light.destructive + "20",
        onPrimary: Colors.light.primaryForeground,
        onPrimaryContainer: Colors.light.accentForeground,
        onSecondary: Colors.light.secondaryForeground,
        onSecondaryContainer: Colors.light.mutedForeground,
        onTertiary: Colors.light.primaryForeground,
        onSurface: Colors.light.foreground,
        onSurfaceVariant: Colors.light.cardForeground,
        onBackground: Colors.light.foreground,
        onError: Colors.light.destructiveForeground,
        onErrorContainer: Colors.light.destructive,
        outline: Colors.light.border,
        outlineVariant: Colors.light.border + "80",
        inverseSurface: Colors.light.accent,
        inverseOnSurface: Colors.light.accentForeground,
        inversePrimary: Colors.light.primary,
        shadow: Colors.light.ring,
        scrim: Colors.light.ring + "80",
        backdrop: Colors.light.ring + "40",
    },
    fonts: {
        ...MD3LightTheme.fonts,
        default: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "normal" as const,
        },
        medium: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "500" as const,
        },
        light: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "300" as const,
        },
        thin: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "100" as const,
        },
    },
    roundness: ThemeConstants.radius.md,
};

// 커스텀 다크 테마
export const CustomDarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: Colors.dark.primary,
        primaryContainer: Colors.dark.accent,
        secondary: Colors.dark.secondary,
        secondaryContainer: Colors.dark.muted,
        tertiary: Colors.dark.accentForeground,
        surface: Colors.dark.background,
        surfaceVariant: Colors.dark.card,
        background: Colors.dark.background,
        error: Colors.dark.destructive,
        errorContainer: Colors.dark.destructive + "20",
        onPrimary: Colors.dark.primaryForeground,
        onPrimaryContainer: Colors.dark.accentForeground,
        onSecondary: Colors.dark.secondaryForeground,
        onSecondaryContainer: Colors.dark.mutedForeground,
        onTertiary: Colors.dark.primaryForeground,
        onSurface: Colors.dark.foreground,
        onSurfaceVariant: Colors.dark.cardForeground,
        onBackground: Colors.dark.foreground,
        onError: Colors.dark.destructiveForeground,
        onErrorContainer: Colors.dark.destructive,
        outline: Colors.dark.border,
        outlineVariant: Colors.dark.border + "80",
        inverseSurface: Colors.dark.accent,
        inverseOnSurface: Colors.dark.accentForeground,
        inversePrimary: Colors.dark.primary,
        shadow: Colors.dark.ring,
        scrim: Colors.dark.ring + "80",
        backdrop: Colors.dark.ring + "40",
    },
    fonts: {
        ...MD3DarkTheme.fonts,
        default: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "normal" as const,
        },
        medium: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "500" as const,
        },
        light: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "300" as const,
        },
        thin: {
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "100" as const,
        },
    },
    roundness: ThemeConstants.radius.md,
};

// 테마 타입 정의
export type ThemeType = "light" | "dark";

// 테마 유틸리티 함수
export const getTheme = (themeType: ThemeType) => {
    return themeType === "light" ? CustomLightTheme : CustomDarkTheme;
};

// 색상 유틸리티 함수
export const getColors = (themeType: ThemeType) => {
    return themeType === "light" ? Colors.light : Colors.dark;
};

// 그림자 유틸리티 함수
export const getShadow = (size: "sm" | "md" | "lg" | "xl") => {
    return ThemeConstants.shadows[size];
};

// 간격 유틸리티 함수
export const getSpacing = (size: "xs" | "sm" | "md" | "lg" | "xl") => {
    return ThemeConstants.spacing[size];
};

// 반지름 유틸리티 함수
export const getRadius = (size: "sm" | "md" | "lg" | "xl") => {
    return ThemeConstants.radius[size];
};
