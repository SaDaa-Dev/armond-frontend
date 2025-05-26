import axios from "axios";
import { AxiosRequestConfig, Method } from "axios";
import { AxiosInstance } from "axios";
import { BASE_URL } from "../constants/ApiConst";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

// 전역 네비게이션 참조를 위한 변수
let navigationRef: any = null;

// 네비게이션 참조 설정 함수
export const setNavigationRef = (ref: any) => {
    navigationRef = ref;
};

// 초기화면으로 이동하는 함수
export const navigateToInitialScreen = () => {
    if (navigationRef) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "(auth)/login" }],
            })
        );
    }
};

// axios 인스턴스 확장
export const createApiClient = (): AxiosInstance & {
    requestWithMethod: (
        method: Method,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ) => Promise<any>;
} => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 10000,
    });

    // 요청 인터셉터 설정
    instance.interceptors.request.use(
        async (config) => {
            const accessToken = await SecureStore.getItemAsync("access_token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터 설정
    instance.interceptors.response.use(
        (response) => {
            // 응답 시 처리
            return response;
        },
        (error) => {
            if (!axios.isAxiosError(error)) {
                return Promise.reject(error);
            }

            const alertConfig = {
                confirmText: "확인",
                onConfirm: () => navigateToInitialScreen()
            };

            // 에러 타입별 알림 설정
            const errorAlerts = {
                networkError: {
                    title: "네트워크 오류",
                    message: "인터넷 연결을 확인해주세요.",
                    shouldShow: !error.response
                },
                timeoutError: {
                    title: "연결 시간 초과", 
                    message: "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
                    shouldShow: error.code === "ECONNABORTED"
                },
                serverError: {
                    title: "서버 오류",
                    message: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    shouldShow: error.response?.status && error.response?.status >= 500
                },
                authError: {
                    title: "인증 오류",
                    message: "로그인이 필요한 서비스입니다.",
                    shouldShow: error.response?.status && [401, 403].includes(error.response?.status)
                }
            };

            // 해당하는 에러 찾아서 알림 표시
            Object.values(errorAlerts).forEach(({ title, message, shouldShow }) => {
                if (shouldShow) {
                    Alert.alert(title, message, [{
                        text: alertConfig.confirmText,
                        onPress: alertConfig.onConfirm
                    }]);
                }
            });

            return Promise.reject(error);
        }
    );

    // method를 쉽게 변경할 수 있는 함수 추가
    const requestWithMethod = async (
        method: Method,
        url: string,
        data?: any,
        config: AxiosRequestConfig = {}
    ) => {
        return instance.request({
            method,
            url,
            data,
            ...config,
        });
    };

    // instance에 함수 추가
    (instance as any).requestWithMethod = requestWithMethod;

    return instance as any;
}; 