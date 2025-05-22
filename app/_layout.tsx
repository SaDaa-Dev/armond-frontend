declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
        __REACT_DEVTOOLS_PORT__?: number;
    }
}

import { setNavigationRef } from "@/src/api/axiosService";
import ServerErrorModal from "@/src/components/common/Button/ServerErrorModal";
import { 
    initializeApp, 
    type InitialRoute,
    resetServerErrorAlert
} from "@/src/services/appInitializationService";
import { store } from "@/src/store/configureStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, useNavigation, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

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

const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        background: "#1E1E1E", // 전체 배경 (차콜 그레이)
        surface: "#2B2B2B", // 카드 배경 (밝은 차콜)
        primary: "#9C27B0", // 메인 색상 (진한 퍼플)
        secondary: "#7E57C2", // 보조 색상 (밝은 퍼플)
        tertiary: "#8A2BE2", // 추가 강조 색상 (블루 바이올렛)
        elevation: {
            level0: "#1E1E1E", // 기본 배경
            level1: "#2B2B2B", // 카드, 탭바 등의 배경
            level2: "#323232", // 살짝 더 밝은 요소
            level3: "#383838", // 호버/프레스 상태
            level4: "#3F3F3F", // 모달/다이얼로그
            level5: "#454545", // 최상위 요소
        },
    },
};

export default function RootLayout() {
    const [serverError, setServerError] = useState<boolean>(false);
    const [isAppReady, setIsAppReady] = useState<boolean>(false);
    const [initialRoute, setInitialRoute] = useState<InitialRoute | null>(null);
    const [hasInitialized, setHasInitialized] = useState<boolean>(false);
    const navigation = useNavigation();

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
            
            // 서버 에러 알림 플래그 리셋
            resetServerErrorAlert();
            
            console.log("🚀 앱 초기화 시작");
            const result = await initializeApp();
            
            console.log("초기화 결과:", result);
            
            setServerError(result.hasServerError);
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
        if (isAppReady && initialRoute) {
            console.log("✅ 앱 준비 완료 - Splash screen 숨기기");
            await SplashScreen.hideAsync();
            
            // 서버 에러가 있으면 라우팅하지 않음 (모달만 표시)
            if (!serverError) {
                setTimeout(() => {
                    console.log("🔄 라우팅 수행:", initialRoute);
                    router.replace(initialRoute);
                }, 100);
            } else {
                console.log("🚫 서버 에러로 인해 라우팅 건너뜀");
            }
        }
    }, [isAppReady, initialRoute, serverError]);

    useEffect(() => {
        handleAppInitialization();
    }, []);

    // 앱이 아직 준비되지 않았으면 아무것도 렌더링하지 않음 (splash screen이 계속 보임)
    if (!isAppReady || !initialRoute) {
        return null;
    }

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
                    <SafeAreaProvider>
                        <StatusBar style="light" backgroundColor="#1E1E1E" translucent={false} />
                        <PaperProvider theme={darkTheme}>
                            <Slot />
                        </PaperProvider>
                        <ServerErrorModal serverError={serverError} />
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </QueryClientProvider>
            <Toast />
        </Provider>
    );
}
