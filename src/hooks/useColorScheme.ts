import { useColorScheme as useNativeColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { Colors } from "@/utils/Colors";
import {
    getColors,
    getTheme,
    getShadow,
    getSpacing,
    getRadius,
} from "@/utils/Theme";
import type { ThemeType } from "@/utils/Theme";

/**
 * 기본 useColorScheme 훅 (기존 호환성 유지)
 */
export { useColorScheme } from "react-native";

/**
 * 새로운 테마 시스템을 활용하는 커스텀 훅
 */
export function useAppTheme() {
    const colorScheme = useNativeColorScheme();
    const paperTheme = useTheme();
    const isDark = colorScheme === "dark";

    return {
        colorScheme: (colorScheme || "light") as ThemeType,
        isDark,
        isLight: !isDark,
        colors: getColors(colorScheme || "light"),
        theme: getTheme(colorScheme || "light"),
        paperTheme,
        // 유틸리티 함수들
        getShadow,
        getSpacing,
        getRadius,
    };
}

/**
 * 빠른 색상 접근을 위한 훅
 */
export function useAppColors() {
    const colorScheme = useNativeColorScheme();
    return getColors(colorScheme || "light");
}

/**
 * 특정 색상 팔레트를 가져오는 훅
 */
export function useColorPalette(
    type: "chart" | "sidebar" | "primary" | "all" = "all"
) {
    const colors = useAppColors();

    switch (type) {
        case "chart":
            return {
                chart1: colors.chart1,
                chart2: colors.chart2,
                chart3: colors.chart3,
                chart4: colors.chart4,
                chart5: colors.chart5,
            };
        case "sidebar":
            return {
                sidebar: colors.sidebar,
                sidebarForeground: colors.sidebarForeground,
                sidebarPrimary: colors.sidebarPrimary,
                sidebarPrimaryForeground: colors.sidebarPrimaryForeground,
                sidebarAccent: colors.sidebarAccent,
                sidebarAccentForeground: colors.sidebarAccentForeground,
                sidebarBorder: colors.sidebarBorder,
                sidebarRing: colors.sidebarRing,
            };
        case "primary":
            return {
                primary: colors.primary,
                primaryForeground: colors.primaryForeground,
                secondary: colors.secondary,
                secondaryForeground: colors.secondaryForeground,
                accent: colors.accent,
                accentForeground: colors.accentForeground,
            };
        default:
            return colors;
    }
}

/**
 * 테마 기반 스타일 생성 도우미
 */
export function useThemedStyles() {
    const { colors, getShadow, getSpacing, getRadius } = useAppTheme();

    return {
        // 기본 컨테이너 스타일
        container: {
            backgroundColor: colors.background,
            flex: 1,
        },
        // 카드 스타일
        card: {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: getRadius("md"),
            padding: getSpacing("md"),
            ...getShadow("sm"),
        },
        // 기본 텍스트 스타일
        text: {
            color: colors.foreground,
        },
        // 보조 텍스트 스타일
        mutedText: {
            color: colors.mutedForeground,
        },
        // 구분선 스타일
        separator: {
            backgroundColor: colors.border,
            height: 1,
        },
        // 버튼 스타일
        primaryButton: {
            backgroundColor: colors.primary,
            borderRadius: getRadius("md"),
            padding: getSpacing("md"),
        },
        secondaryButton: {
            backgroundColor: colors.secondary,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: getRadius("md"),
            padding: getSpacing("md"),
        },
        // 입력 필드 스타일
        input: {
            backgroundColor: colors.input,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: getRadius("md"),
            color: colors.foreground,
            padding: getSpacing("md"),
        },
    };
}
