declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
        __REACT_DEVTOOLS_PORT__?: number;
    }
}

import { setNavigationRef } from "@/src/api/axiosService";
import {
    initializeApp,
    type InitialRoute,
} from "@/src/services/appInitializationService";
import { store } from "@/src/store/configureStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, useNavigation, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { CustomLightTheme, CustomDarkTheme } from "@/utils/Theme";
import { ThemeProvider, useThemeContext } from "@/src/contexts/ThemeContext";

// React Native Debugger 설정
if (__DEV__) {
    // @ts-ignore
    global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    // @ts-ignore
    global.FormData = global.originalFormData || global.FormData;

    // React Native Debugger 포트 설정
    // @ts-ignore
    window.__REACT_DEVTOOLS_PORT__ = 19000;
}

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

const queryClient = new QueryClient();

function AppContent() {
    const [isAppReady, setIsAppReady] = useState<boolean>(false);
    const [initialRoute, setInitialRoute] = useState<InitialRoute | null>(null);
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);
    const navigation = useNavigation();
    const { isDark, isLoading: themeLoading } = useThemeContext();

    // 사용자 설정에 따라 적절한 테마 선택
    const theme = isDark ? CustomDarkTheme : CustomLightTheme;

    useEffect(() => {
        if (navigation) {
            setNavigationRef(navigation);
        }
    }, [navigation]);

    // 앱 초기화 실행
    const handleAppInitialization = async () => {
        // 중복 초기화 방지
        if (hasInitialized) {
            return;
        }

        try {
            setHasInitialized(true);

            console.log("🚀 앱 초기화 시작");
            const result = await initializeApp();

            console.log("초기화 결과:", result);

            setInitialRoute(result.initialRoute);

            if (!result.isSuccess && result.errorMessage) {
                console.warn("⚠️ 초기화 경고:", result.errorMessage);
            }
        } catch (error) {
            console.error("💥 초기화 처리 오류:", error);
            setInitialRoute("/(auth)/login");
        } finally {
            setIsAppReady(true);
        }
    };

    // 앱이 준비되면 splash screen 숨기기
    const onLayoutRootView = useCallback(async () => {
        if (isAppReady && initialRoute && !themeLoading) {
            console.log("✅ 앱 준비 완료 - Splash screen 숨기기");
            await SplashScreen.hideAsync();

            setTimeout(() => {
                console.log("🔄 라우팅 수행:", initialRoute);
                router.replace(initialRoute);
            }, 100);
        }
    }, [isAppReady, initialRoute, themeLoading]);

    useEffect(() => {
        if (!themeLoading) {
            handleAppInitialization();
        }
    }, [themeLoading]);

    // 앱이 아직 준비되지 않았으면 아무것도 렌더링하지 않음 (splash screen이 계속 보임)
    if (!isAppReady || !initialRoute || themeLoading) {
        return null;
    }

    return (
        <GestureHandlerRootView
            style={{ flex: 1 }}
            onLayout={onLayoutRootView}
        >
            <SafeAreaProvider>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <PaperProvider theme={theme}>
                    <Slot />
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </QueryClientProvider>
            <Toast />
        </Provider>
    );
}
