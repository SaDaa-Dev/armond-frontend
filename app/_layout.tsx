declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
        __REACT_DEVTOOLS_PORT__?: number;
    }
}

import { authApi } from "@/src/api/auth/authApi";
import { setNavigationRef } from "@/src/api/axiosService";
import ServerErrorModal from "@/src/components/common/Button/ServerErrorModal";
import { store } from "@/src/store/configureStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useNavigation, Slot } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    ActivityIndicator,
    MD3DarkTheme,
    PaperProvider
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

// 토큰 키
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [initialRoute, setInitialRoute] = useState<"/(auth)/login" | "/(tabs)" | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation) {
            setNavigationRef(navigation);
        }
    }, [navigation]);

    // 초기 라우팅을 처리하는 useEffect
    useEffect(() => {
        if (!isLoading && initialRoute) {
            console.log("라우팅 시도:", initialRoute);
            setTimeout(() => {
                router.replace(initialRoute);
            }, 300); // 타이머 시간 증가
        }
    }, [isLoading, initialRoute]);

    const checkAuthentication = async () => {
        try {
            const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            return !!token;
        } catch {
            return false;
        }
    };

    const initializeApp = async () => {
        try {
            const isConnected = await authApi.checkHealth();
            if (!isConnected) {
                Alert.alert("서버 연결 실패", "서버 연결에 실패했습니다.");
                setServerError(true);
                setInitialRoute("/(auth)/login");
                setIsLoading(false);
                return;
            }

            const isAuthenticated = await checkAuthentication();
            
            setInitialRoute(isAuthenticated ? "/(tabs)" : "/(auth)/login");
            setIsLoading(false);
        } catch (error) {
            console.error("초기화 오류:", error);
            setInitialRoute("/(auth)/login");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("앱 초기화 시작");
        const timer = setTimeout(() => {
            initializeApp();
        }, 1500); // 타이머 시간 증가

        return () => clearTimeout(timer);
    }, []);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaProvider>
                        <StatusBar style="light" backgroundColor="#1E1E1E" translucent={false} />
                        <PaperProvider theme={darkTheme}>
                            {isLoading ? (
                                <View style={{ flex: 1, backgroundColor: "#1E1E1E", justifyContent: "center", alignItems: "center" }}>
                                    <ActivityIndicator size="large" color="#9C27B0" />
                                </View>
                            ) : (
                                <Slot />
                            )}
                        </PaperProvider>
                        <ServerErrorModal serverError={serverError} />
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </QueryClientProvider>
            <Toast />
        </Provider>
    );
}
