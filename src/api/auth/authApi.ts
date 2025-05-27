import { BASE_URL } from "../../constants/ApiConst";
import { components } from "../api-types";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { createApiClient } from "../axiosService";
import { router } from "expo-router";
import { Alert, BackHandler } from "react-native";

// 토큰 스토리지 키 상수
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type LoginDto = components["schemas"]["LoginDto"];
type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
type ApiResponseTokenResponse =
    components["schemas"]["ApiResponseTokenResponse"];
type ApiResponseString = components["schemas"]["ApiResponseString"];
type SignUpDto = components["schemas"]["SignUpDto"];

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
            // 네트워크 에러 처리는 axiosService 인터셉터에서 처리
            console.log("서버 Health Check 실패");
            return false;
        }
    },

    login: async (loginDto: LoginDto): Promise<ApiResponseTokenResponse> => {
        try {
            console.log("LoginDto", loginDto);
            const response = await api.requestWithMethod(
                "POST",
                "/auth/login",
                loginDto
            );
            console.log("login response", response.data);
            return response.data;
        } catch (error) {
            throw new Error("로그인에 실패했습니다");
        }
    },

    logout: async (): Promise<ApiResponseString> => {
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

    signup: async (signUpDto: SignUpDto): Promise<ApiResponseTokenResponse> => {
        try {
            const response = await api.requestWithMethod(
                "POST",
                "/auth/signup",
                signUpDto
            );
            return response.data;
        } catch (error) {
            throw new Error("회원가입에 실패했습니다");
        }
    },

    reissue: async (
        refreshToken: string
    ): Promise<ApiResponseTokenResponse> => {
        try {
            const refreshTokenRequest: RefreshTokenRequest = {
                refreshToken,
            };
            const response = await api.requestWithMethod(
                "POST",
                "/auth/reissue",
                refreshTokenRequest
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
