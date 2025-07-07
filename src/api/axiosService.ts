import axios from "axios";
import { AxiosRequestConfig, Method } from "axios";
import { AxiosInstance } from "axios";
import { BASE_URL } from "../constants/ApiConst";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';

// 전역 네비게이션 참조를 위한 변수
let navigationRef: any = null;

// Toast 중복 방지를 위한 플래그들 (간소화)
let toastFlags = {
    networkError: false,
    authError: false
};

// 플래그 리셋 시간 (밀리초)
const TOAST_RESET_TIME = 3000; // 3초

// 플래그 리셋 함수
const resetToastFlag = (errorType: keyof typeof toastFlags) => {
    setTimeout(() => {
        toastFlags[errorType] = false;
    }, TOAST_RESET_TIME);
};

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

            // 네트워크 오류 (서버 연결 불가)
            if (!error.response && !toastFlags.networkError) {
                toastFlags.networkError = true;
                Toast.show({
                    type: 'error',
                    text1: '네트워크 오류',
                    text2: '인터넷 연결을 확인해주세요',
                    visibilityTime: 4000,
                    autoHide: true,
                });
                resetToastFlag('networkError');
            }
            // 타임아웃 오류
            else if (error.code === "ECONNABORTED") {
                Toast.show({
                    type: 'error',
                    text1: '연결 시간 초과',
                    text2: '서버 응답이 지연되고 있습니다',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
            // 서버 오류 (5xx)
            else if (error.response?.status && error.response?.status >= 500) {
                Toast.show({
                    type: 'error',
                    text1: '서버 오류',
                    text2: '서버에 문제가 발생했습니다',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
            // 인증 오류 (401, 403)
            else if (error.response?.status && [401, 403].includes(error.response?.status) && !toastFlags.authError) {
                console.log('인증 오류');
                toastFlags.authError = true;
                Toast.show({
                    type: 'error',
                    text1: '인증 오류',
                    text2: '로그인이 필요합니다',
                    visibilityTime: 3000,
                    autoHide: true,
                    onHide: () => {
                        // 토스트가 사라진 후 로그인 화면으로 이동
                        setTimeout(() => navigateToInitialScreen(), 500);
                    }
                });
                resetToastFlag('authError');
            }

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