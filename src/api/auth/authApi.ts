import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { components } from "../api-types";
import { createApiClient } from "../axiosService";

// 토큰 스토리지 키 상수
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type LoginRequestDto = components["schemas"]["LoginRequestDto"];
type TokenRequestDto = components["schemas"]["TokenDto"];
type TokenResponseDto = components["schemas"]["ApiResponseTokenDto"];
type StringResponseDto = components["schemas"]["ApiResponseString"];
type RegisterRequestDto = components["schemas"]["RegisterRequestDto"];

const api = createApiClient();

export const authApi = {
    checkHealth: async (): Promise<boolean> => {
        try {
            const response = await api.requestWithMethod(
                "GET",
                "/actuator/health"
            );
            return response.data;
        } catch (error) {
            return false;
        }
    },

    login: async (
        loginRequestDto: LoginRequestDto
    ): Promise<TokenResponseDto> => {
        try {
            const response = await api.requestWithMethod(
                "POST",
                "/auth/login",
                loginRequestDto
            );
            console.log("login response", response.data);
            return response.data;
        } catch (error) {
            throw new Error("로그인에 실패했습니다");
        }
    },

    logout: async (): Promise<StringResponseDto> => {
        try {
            console.log("로그아웃 시도");
            const accessToken = await SecureStore.getItemAsync(
                ACCESS_TOKEN_KEY
            );
            console.log("accessToken", accessToken);
            const response = await api.requestWithMethod(
                "POST",
                "/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // 로그아웃 시 SecureStore에서 토큰 제거
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

            return response.data;
        } catch (error) {
            router.replace("/(auth)/login");
            throw new Error("로그아웃에 실패했습니다");
        }
    },

    register: async (registerRequestDto: RegisterRequestDto): Promise<any> => {
        try {
            console.log("🔗 회원가입 요청 시작");
            console.log("📤 요청 데이터:", registerRequestDto);
            console.log("🌐 API 기본 URL:", api.defaults.baseURL);
            console.log("🎯 요청 URL:", `${api.defaults.baseURL}/auth/register`);
            
            const response = await api.requestWithMethod(
                "POST",
                "/auth/register",
                registerRequestDto
            );
            
            console.log("✅ 회원가입 응답:", response.data);
            console.log("✅ 응답 상태:", response.status);
            
            // 백엔드에서 문자열이나 객체 응답을 모두 처리
            if (typeof response.data === 'string') {
                return {
                    status: "SUCCESS",
                    message: response.data,
                    data: response.data
                };
            } else if (response.data && typeof response.data === 'object') {
                return response.data;
            } else {
                return {
                    status: "SUCCESS",
                    message: "회원가입이 완료되었습니다.",
                    data: response.data
                };
            }
        } catch (error: any) {
            console.error("❌ 회원가입 실패:");
            console.error("에러 객체:", error);
            
            if (error.response) {
                // 서버가 응답했지만 에러 상태 코드
                console.error("응답 상태:", error.response.status);
                console.error("응답 데이터:", error.response.data);
                console.error("응답 헤더:", error.response.headers);
                
                // 백엔드 validation 에러 메시지 추출
                if (error.response.data && error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            } else if (error.request) {
                // 요청은 보냈지만 응답을 받지 못함
                console.error("요청 객체:", error.request);
                console.error("네트워크 오류 또는 서버 연결 실패");
                throw new Error("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
            } else {
                // 요청 설정 중 에러
                console.error("요청 설정 에러:", error.message);
                throw new Error(`요청 설정 오류: ${error.message}`);
            }
            
            throw new Error(`회원가입에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
        }
    },

    reissue: async (refreshToken: string): Promise<TokenResponseDto> => {
        try {
            const tokenRequestDto: TokenRequestDto = {
                refreshToken,
            };
            const response = await api.requestWithMethod(
                "POST",
                "/auth/reissue",
                tokenRequestDto
            );
            return response.data;
        } catch (error) {
            throw new Error("토큰 갱신에 실패했습니다");
        }
    },

    // 토큰 저장 유틸리티 함수
    setTokens: async (
        accessToken: string,
        refreshToken: string
    ): Promise<void> => {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    },

    // 현재 액세스 토큰 조회
    getAccessToken: async (): Promise<string | null> => {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    // 현재 리프레시 토큰 조회
    getRefreshToken: async (): Promise<string | null> => {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },
};
