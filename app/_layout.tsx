declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
        __REACT_DEVTOOLS_PORT__?: number;
    }
}

import { store } from "@/src/store/configureStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, MD3DarkTheme, PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { authApi } from "@/src/api/auth/authApi";
import { View } from "react-native";
import ServerErrorModal from "@/src/components/common/Button/ServerErrorModal";
import { setNavigationRef } from "@/src/api/axiosService";
import { useNavigation } from "expo-router";

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [serverError, setServerError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    
    // 네비게이션 레퍼런스 설정
    useEffect(() => {
        if (navigation) {
            setNavigationRef(navigation);
        }
    }, [navigation]);
    
    useEffect(() => {
    
        // 앱 시작시 서버 연결 확인 후 인증 상태 확인 
        const initializeApp = async () => {
            try {
                const isConnected = await authApi.checkHealth();

                if (!isConnected) {
                    setServerError(true);
                    setIsAuthenticated(false);
                    return;
                }

                const accessToken = await authApi.getAccessToken();
                setIsAuthenticated(!!accessToken);  
                setIsLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            initializeApp();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    
    useReactQueryDevTools(queryClient);
    
    // 인증 상태 로딩 중일 때 로딩 표시
    if (isAuthenticated === null) {
        return (
            <SafeAreaProvider>
                <StatusBar style="light" backgroundColor="#1E1E1E" translucent={false} />
                <View style={{ 
                    flex: 1, 
                    backgroundColor: "#1E1E1E", 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                    <Text style={{ 
                        fontSize: 42, 
                        fontWeight: 'bold', 
                        color: '#9C27B0', 
                        marginBottom: 20 
                    }}>
                        아몬드
                    </Text>
                    <Text style={{ 
                        fontSize: 16, 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        marginBottom: 30 
                    }}>
                        운동 기록을 더 쉽게
                    </Text>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            </SafeAreaProvider>
        );
    }
    
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <SafeAreaProvider>
                        <StatusBar
                            style="light"
                            backgroundColor="#1E1E1E"
                            translucent={false}
                        />
                        <PaperProvider theme={darkTheme}>
                            <Stack screenOptions={{ headerShown: false }}>
                                {isAuthenticated ? (
                                    <Stack.Screen
                                        name="(tabs)"
                                        options={{ headerShown: false }}
                                    />
                                ) : (
                                    <Stack.Screen
                                        name="(auth)/login"
                                        options={{ headerShown: false }}
                                    />
                                )}
                            </Stack>
                        </PaperProvider>
                        <ServerErrorModal serverError={serverError} />
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </QueryClientProvider>
            <Toast />
        </Provider>
    );
}
