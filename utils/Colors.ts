/**
 * 새로운 테마 색상 시스템
 * 라이트 모드와 다크 모드를 지원하는 포괄적인 색상 팔레트
 */

export const Colors = {
    light: {
        // 기본 색상
        background: "#fdfdfd",
        foreground: "#000000",
        card: "#fdfdfd",
        cardForeground: "#000000",
        popover: "#fcfcfc",
        popoverForeground: "#000000",

        // 브랜드 색상
        primary: "#7033ff",
        primaryForeground: "#ffffff",
        secondary: "#edf0f4",
        secondaryForeground: "#080808",

        // 상태 색상
        muted: "#f5f5f5",
        mutedForeground: "#525252",
        accent: "#e2ebff",
        accentForeground: "#1e69dc",
        destructive: "#e54b4f",
        destructiveForeground: "#ffffff",

        // 인터페이스 색상
        border: "#e7e7ee",
        input: "#ebebeb",
        ring: "#000000",

        // 차트 색상
        chart1: "#4ac885",
        chart2: "#7033ff",
        chart3: "#fd822b",
        chart4: "#3276e4",
        chart5: "#747474",

        // 사이드바 색상
        sidebar: "#f5f8fb",
        sidebarForeground: "#000000",
        sidebarPrimary: "#000000",
        sidebarPrimaryForeground: "#ffffff",
        sidebarAccent: "#ebebeb",
        sidebarAccentForeground: "#000000",
        sidebarBorder: "#ebebeb",
        sidebarRing: "#000000",

        // 기존 호환성을 위한 색상
        text: "#000000",
        tint: "#7033ff",
        icon: "#525252",
        tabIconDefault: "#525252",
        tabIconSelected: "#7033ff",
    },
    dark: {
        // 기본 색상
        background: "#1a1b1e",
        foreground: "#f0f0f0",
        card: "#222327",
        cardForeground: "#f0f0f0",
        popover: "#222327",
        popoverForeground: "#f0f0f0",

        // 브랜드 색상
        primary: "#8c5cff",
        primaryForeground: "#ffffff",
        secondary: "#2a2c33",
        secondaryForeground: "#f0f0f0",

        // 상태 색상
        muted: "#2a2c33",
        mutedForeground: "#a0a0a0",
        accent: "#1e293b",
        accentForeground: "#79c0ff",
        destructive: "#f87171",
        destructiveForeground: "#ffffff",

        // 인터페이스 색상
        border: "#33353a",
        input: "#33353a",
        ring: "#8c5cff",

        // 차트 색상
        chart1: "#4ade80",
        chart2: "#8c5cff",
        chart3: "#fca5a5",
        chart4: "#5993f4",
        chart5: "#a0a0a0",

        // 사이드바 색상
        sidebar: "#161618",
        sidebarForeground: "#f0f0f0",
        sidebarPrimary: "#8c5cff",
        sidebarPrimaryForeground: "#ffffff",
        sidebarAccent: "#2a2c33",
        sidebarAccentForeground: "#8c5cff",
        sidebarBorder: "#33353a",
        sidebarRing: "#8c5cff",

        // 기존 호환성을 위한 색상
        text: "#f0f0f0",
        tint: "#8c5cff",
        icon: "#a0a0a0",
        tabIconDefault: "#a0a0a0",
        tabIconSelected: "#8c5cff",
    },
};

// 테마 관련 상수
export const ThemeConstants = {
    fonts: {
        sans: "Plus Jakarta Sans, sans-serif",
        serif: "Lora, serif",
        mono: "IBM Plex Mono, monospace",
    },
    radius: {
        sm: 18, // 22px - 4px
        md: 20, // 22px - 2px
        lg: 22, // 22px (1.4rem ≈ 22px)
        xl: 26, // 22px + 4px
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    shadows: {
        sm: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 2,
        },
        md: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.16,
            shadowRadius: 4,
            elevation: 4,
        },
        lg: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.16,
            shadowRadius: 6,
            elevation: 8,
        },
        xl: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.16,
            shadowRadius: 10,
            elevation: 12,
        },
    },
};
