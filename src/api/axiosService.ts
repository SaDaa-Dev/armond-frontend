import axios from "axios";
import { AxiosRequestConfig, Method } from "axios";
import { AxiosInstance } from "axios";
import { BASE_URL } from "../constants/ApiConst";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-toast-message';
import { ApiErrorResponse, ErrorCode } from './errorTypes';
import { 
    getErrorInfo, 
    getUserMessage, 
    shouldLogoutForError, 
    isAuthError, 
    isSystemError,
    isValidationError 
} from '@/src/utils/errorUtils';

// 전역 네비게이션 참조를 위한 변수
let navigationRef: any = null;

// Toast 중복 방지를 위한 플래그들 (간소화)
let toastFlags = {
    networkError: false,
    authError: false,
    systemError: false
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

// 에러 응답 처리 함수
const handleErrorResponse = (errorResponse: ApiErrorResponse) => {
    const { errorCode, message } = errorResponse;
    
    if (!errorCode) {
        // 에러 코드가 없는 경우 기본 메시지 표시
        Toast.show({
            type: 'error',
            text1: '오류 발생',
            text2: message || '알 수 없는 오류가 발생했습니다',
            visibilityTime: 3000,
            autoHide: true,
        });
        return;
    }

    const userMessage = getUserMessage(errorCode, message);
    
    // 인증 에러 처리
    if (isAuthError(errorCode) && !toastFlags.authError) {
        toastFlags.authError = true;
        Toast.show({
            type: 'error',
            text1: '인증 오류',
            text2: userMessage,
            visibilityTime: 3000,
            autoHide: true,
            onHide: () => {
                if (shouldLogoutForError(errorCode)) {
                    setTimeout(() => navigateToInitialScreen(), 500);
                }
            }
        });
        resetToastFlag('authError');
    }
    // 시스템 에러 처리
    else if (isSystemError(errorCode) && !toastFlags.systemError) {
        toastFlags.systemError = true;
        Toast.show({
            type: 'error',
            text1: '시스템 오류',
            text2: userMessage,
            visibilityTime: 4000,
            autoHide: true,
        });
        resetToastFlag('systemError');
    }
    // 검증 에러 처리
    else if (isValidationError(errorCode)) {
        Toast.show({
            type: 'error',
            text1: '입력 오류',
            text2: userMessage,
            visibilityTime: 3000,
            autoHide: true,
        });
    }
    // 기타 에러 처리
    else {
        Toast.show({
            type: 'error',
            text1: '오류 발생',
            text2: userMessage,
            visibilityTime: 3000,
            autoHide: true,
        });
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
            // 개발 환경에서만 상세 로그 출력
            if (__DEV__) {
                console.log(
                    `[REQUEST] ${config.method?.toUpperCase()} | ${config.url}`,
                    config.data ? `| ${JSON.stringify(config.data)}` : ""
                );
                console.log("Request Config:", config);
            }

            const accessToken = await SecureStore.getItemAsync("access_token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => {
            if (__DEV__) {
                console.log("Request Error:", error);
            }
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
                return Promise.reject(error);
            }
            
            // 타임아웃 오류
            if (error.code === "ECONNABORTED") {
                Toast.show({
                    type: 'error',
                    text1: '연결 시간 초과',
                    text2: '서버 응답이 지연되고 있습니다',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                return Promise.reject(error);
            }

            // 백엔드 에러 응답 처리
            if (error.response?.data) {
                const errorData = error.response.data;
                
                // 백엔드 에러 응답 구조인지 확인
                if (errorData.status && ['fail', 'error'].includes(errorData.status)) {
                    handleErrorResponse(errorData as ApiErrorResponse);
                    return Promise.reject(error);
                }
            }

            // 기존 HTTP 상태 코드 기반 처리 (fallback)
            const status = error.response?.status;
            
            if (status && status >= 500) {
                if (!toastFlags.systemError) {
                    toastFlags.systemError = true;
                    Toast.show({
                        type: 'error',
                        text1: '서버 오류',
                        text2: '서버에 문제가 발생했습니다',
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                    resetToastFlag('systemError');
                }
            } else if (status && [401, 403].includes(status) && !toastFlags.authError) {
                console.log('인증 오류 (HTTP 상태 코드 기반)');
                toastFlags.authError = true;
                Toast.show({
                    type: 'error',
                    text1: '인증 오류',
                    text2: '로그인이 필요합니다',
                    visibilityTime: 3000,
                    autoHide: true,
                    onHide: () => {
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