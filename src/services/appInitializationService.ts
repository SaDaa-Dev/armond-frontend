import { authApi } from "../api/auth/authApi";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createApiClient } from "../api/axiosService";

// 토큰 키 상수
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Alert 중복 표시 방지를 위한 플래그
let hasShownServerErrorAlert = false;

// 초기 라우팅 타입
export type InitialRoute = "/(auth)/login" | "/(tabs)";

// 앱 초기화 결과 타입
export interface AppInitializationResult {
    isSuccess: boolean;
    initialRoute: InitialRoute;
    hasServerError: boolean;
    errorMessage?: string;
}

/**
 * 저장된 액세스 토큰 존재 여부 확인
 */
export const checkTokenAuthentication = async (): Promise<boolean> => {
    try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        return !!accessToken;
    } catch (error) {
        console.error("토큰 확인 오류:", error);
        return false;
    }
};

/**
 * 서버 상태 확인 (Health Check) - Alert 없이 순수하게 상태만 확인
 */
export const checkServerHealth = async (): Promise<boolean> => {
    try {
        console.log("서버 Health Check 진행 중...");
        
        // authApi.checkHealth 대신 직접 health check 수행 (alert 없이)
        const api = createApiClient();
        const response = await api.requestWithMethod("GET", "/actuator/health");
        
        console.log("서버 Health Check 성공");
        return true;
    } catch (error) {
        console.log("서버 Health Check 실패");
        
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                console.log("서버 연결 시간 초과");
            } else if (!error.response) {
                console.log("서버에 연결할 수 없습니다");
            }
        }
        
        return false;
    }
};

/**
 * Alert 중복 표시 방지 플래그 리셋
 */
export const resetServerErrorAlert = (): void => {
    hasShownServerErrorAlert = false;
};

/**
 * 액세스 토큰 유효성 검증 (옵션)
 * 실제 API 호출로 토큰이 유효한지 확인하고 싶을 때 사용
 */
export const validateAccessToken = async (): Promise<boolean> => {
    try {
        const accessToken = await authApi.getAccessToken();
        if (!accessToken) {
            return false;
        }

        // TODO: 실제 토큰 검증 API 엔드포인트가 있다면 여기서 호출
        // 예: await authApi.validateToken(accessToken);

        return true;
    } catch (error) {
        console.error("토큰 유효성 검증 오류:", error);
        return false;
    }
};

/**
 * 앱 초기화 프로세스 실행
 * 1. 서버 Health Check
 * 2. 토큰 기반 인증 상태 확인
 * 3. 초기 라우팅 결정
 */
export const initializeApp = async (): Promise<AppInitializationResult> => {
    try {
        // 1. 서버 Health Check (Alert 없이)
        const isServerHealthy = await checkServerHealth();
        if (!isServerHealthy) {
            return {
                isSuccess: false,
                initialRoute: "/(auth)/login",
                hasServerError: true,
                errorMessage: "서버 연결에 실패했습니다",
            };
        }

        // 2. 토큰 기반 인증 상태 확인
        console.log("🔐 인증 상태 확인 중...");
        const isAuthenticated = await checkTokenAuthentication();

        // 3. 선택적으로 토큰 유효성 추가 검증
        // const isTokenValid = isAuthenticated ? await validateAccessToken() : false;

        const initialRoute: InitialRoute = isAuthenticated
            ? "/(tabs)"
            : "/(auth)/login";

        console.log(
            `✅ 초기화 완료 - 인증 상태: ${
                isAuthenticated ? "인증됨" : "인증되지 않음"
            }`
        );
        console.log(`📱 초기 라우팅: ${initialRoute}`);

        return {
            isSuccess: true,
            initialRoute,
            hasServerError: false,
        };
    } catch (error) {
        console.error("❌ 앱 초기화 오류:", error);

        return {
            isSuccess: false,
            initialRoute: "/(auth)/login",
            hasServerError: false,
            errorMessage:
                error instanceof Error
                    ? error.message
                    : "초기화 중 알 수 없는 오류가 발생했습니다",
        };
    }
};

/**
 * 토큰 관련 유틸리티 함수들 (기존 authApi에서 가져오거나 확장)
 */
export const tokenUtils = {
    /**
     * 액세스 토큰 조회
     */
    getAccessToken: async (): Promise<string | null> => {
        return await authApi.getAccessToken();
    },

    /**
     * 리프레시 토큰 조회
     */
    getRefreshToken: async (): Promise<string | null> => {
        return await authApi.getRefreshToken();
    },

    /**
     * 토큰 저장
     */
    setTokens: async (
        accessToken: string,
        refreshToken: string
    ): Promise<void> => {
        return await authApi.setTokens(accessToken, refreshToken);
    },

    /**
     * 모든 토큰 삭제
     */
    clearTokens: async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            console.log("토큰 삭제 완료");
        } catch (error) {
            console.error("토큰 삭제 오류:", error);
        }
    },
};
