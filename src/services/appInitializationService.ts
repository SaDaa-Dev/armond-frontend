import { authApi } from "../api/auth/authApi";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createApiClient } from "../api/axiosService";
import { store } from '@/src/store/configureStore';
import { setAuthenticated, setMemberInfo, setAuthLoading } from '@/src/store/features/authSlice';

// 토큰 키 상수
const ACCESS_TOKEN_KEY = "access_token";    
const REFRESH_TOKEN_KEY = "refresh_token";

// 초기 라우팅 타입
export type InitialRoute = "/(auth)/login" | "/(tabs)/workout";

// 앱 초기화 결과 타입
export interface AppInitializationResult {
    isSuccess: boolean;
    initialRoute: InitialRoute;
    errorMessage?: string;
}

/**
 * 토큰 기반 인증 상태 확인
 * 저장된 액세스 토큰과 리프레시 토큰의 존재 여부로 인증 상태를 판단합니다.
 */
export const isTokenExist = async (): Promise<boolean> => {
    try {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        // 토큰이 모두 존재하면 인증된 것으로 간주
        const isAuthenticated = !!(accessToken && refreshToken);

        console.log(`토큰 확인 - 액세스: ${!!accessToken}, 리프레시: ${!!refreshToken}`);
        
        return isAuthenticated;
    } catch (error) {
        console.error("토큰 인증 확인 오류:", error);
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
 * 토큰 기반 인증 상태 확인 후 초기 라우팅 결정
 */
export const initializeApp = async (): Promise<InitialRoute> => {
    store.dispatch(setAuthLoading(true));
    
    try {
        console.log("앱 초기화 시작");
        
        // 1. 토큰 확인
        const accessToken = await authApi.getAccessToken();
        const refreshToken = await authApi.getRefreshToken();
        
        console.log(`토큰 확인 - 액세스: ${!!accessToken}, 리프레시: ${!!refreshToken}`);
        
        if (accessToken && refreshToken) {
            // 2. 사용자 정보 로드
            const memberInfo = await authApi.getMemberInfo();
            
            if (memberInfo) {
                console.log("앱 초기화: 인증 성공, 메인 화면으로 이동");
                store.dispatch(setAuthenticated(true));
                store.dispatch(setMemberInfo(memberInfo));
                return "/(tabs)/workout";
            } else {
                // 토큰은 있지만 사용자 정보가 없는 경우
                console.log("앱 초기화: 사용자 정보 없음, 로그아웃 처리");
                store.dispatch(setAuthenticated(false));
                store.dispatch(setMemberInfo(null));
                await authApi.clearAllStoredData();
                return "/(auth)/login";
            }
        } else {
            console.log("앱 초기화: 토큰 없음, 로그인 화면으로 이동");
            store.dispatch(setAuthenticated(false));
            store.dispatch(setMemberInfo(null));
            return "/(auth)/login";
        }
    } catch (error) {
        console.error('앱 초기화 실패:', error);
        store.dispatch(setAuthenticated(false));
        store.dispatch(setMemberInfo(null));
        await authApi.clearAllStoredData();
        return "/(auth)/login";
    } finally {
        store.dispatch(setAuthLoading(false));
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
