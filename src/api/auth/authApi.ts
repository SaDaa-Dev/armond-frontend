import { BASE_URL } from "../../constants/ApiConst";
import { components } from "../api-types";
import * as SecureStore from "expo-secure-store";

// 토큰 스토리지 키 상수
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type LoginDto = components["schemas"]["LoginDto"];
type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
type ApiResponseTokenResponse =
    components["schemas"]["ApiResponseTokenResponse"];
type ApiResponseString = components["schemas"]["ApiResponseString"];
type SignUpDto = components["schemas"]["SignUpDto"];

export const authApi = {
    checkHealth: async (): Promise<boolean> => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${BASE_URL}/actuator/health`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
            });
        
            const responseText = await response.text();
            return response.ok;
        } catch (error) {
            console.log(`서버 연결 실패, ${BASE_URL}/actuator/health`, error); // 에러 상세 내용 출력
            if (
                error instanceof TypeError &&
                error.message === "Failed to fetch"
            ) {
                console.log("서버에 연결할 수 없습니다"); 
            } else if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {
                console.log("서버 연결 시간 초과");
            }
            return false;
        }
    },
    login: async (loginDto: LoginDto): Promise<ApiResponseTokenResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginDto),
        });

        if (!response.ok) {
            throw new Error("로그인에 실패했습니다");
        }

        return response.json();
    },

    logout: async (): Promise<ApiResponseString> => {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("로그아웃에 실패했습니다");
        }

        // 로그아웃 시 SecureStore에서 토큰 제거
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

        return response.json();
    },

    signup: async (signUpDto: SignUpDto): Promise<ApiResponseTokenResponse> => {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpDto),
        });

        if (!response.ok) {
            throw new Error("회원가입에 실패했습니다");
        }

        return response.json();
    },

    reissue: async (
        refreshToken: string
    ): Promise<ApiResponseTokenResponse> => {
        const refreshTokenRequest: RefreshTokenRequest = {
            refreshToken,
        };

        const response = await fetch(`${BASE_URL}/auth/reissue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(refreshTokenRequest),
        });

        if (!response.ok) {
            throw new Error("토큰 갱신에 실패했습니다");
        }

        return response.json();
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
