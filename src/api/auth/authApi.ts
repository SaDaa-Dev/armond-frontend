import { store } from "@/src/store/configureStore";
import { clearAuth, setAuthenticated, setMemberInfo } from "@/src/store/features/authSlice";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { components } from "../api-types";
import { createApiClient } from "../axiosService";

// 토큰 스토리지 키 상수
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const MEMBER_INFO_KEY = "member_info";

type LoginRequestDto = components["schemas"]["LoginRequestDto"];
type TokenResponseDto = components["schemas"]["ApiResponseTokenDto"];
type StringResponseDto = components["schemas"]["ApiResponseString"];
type RegisterRequestDto = components["schemas"]["RegisterRequestDto"];
type MemberInfo = components["schemas"]["MemberInfo"];

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
            console.log("login request", loginRequestDto);
            const response = await api.requestWithMethod(
                "POST",
                "/auth/login",
                loginRequestDto
            );
            
            console.log("login response", response.data);
            
            // 토큰과 사용자 정보 처리
            if (response.data?.data) {
                const tokenData = response.data.data;
                
                // 토큰 저장
                if (tokenData.accessToken && tokenData.refreshToken) {
                    await authApi.setTokens(
                        tokenData.accessToken,
                        tokenData.refreshToken
                    );
                }
                
                // 사용자 정보 저장 및 Redux 상태 업데이트
                if (tokenData.memberInfo) {
                    await authApi.saveMemberInfo(tokenData.memberInfo);
                    store.dispatch(setAuthenticated(true));
                    store.dispatch(setMemberInfo(tokenData.memberInfo));
                    console.log("사용자 정보 저장 완료:", tokenData.memberInfo);
                }
            }
            
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw new Error("로그인에 실패했습니다");
        }
    },

    logout: async (): Promise<StringResponseDto> => {
        try {
            console.log("로그아웃 시도");
            const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            
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

            // 모든 저장된 정보 제거
            await authApi.clearAllStoredData();

            return response.data;
        } catch (error) {
            // 에러가 발생해도 로컬 정보는 삭제
            await authApi.clearAllStoredData();
            router.replace("/(auth)/login");
            throw new Error("로그아웃에 실패했습니다");
        }
    },

    register: async (registerRequestDto: RegisterRequestDto): Promise<any> => {
        try {
            console.log("🔗 회원가입 요청 시작");
            console.log("📤 요청 데이터:", registerRequestDto);
            
            const response = await api.requestWithMethod(
                "POST",
                "/auth/register",
                registerRequestDto
            );
            
            console.log("✅ 회원가입 응답:", response.data);
            
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
            console.error("❌ 회원가입 실패:", error);
            
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
            } else {
                throw new Error(`요청 설정 오류: ${error.message}`);
            }
        }
    },

    reissue: async (refreshToken: string): Promise<TokenResponseDto> => {
        try {
            const response = await api.requestWithMethod(
                "POST",
                "/auth/reissue",
                { refreshToken }
            );
            
            // 토큰 갱신 시에도 사용자 정보 업데이트
            if (response.data?.data) {
                const tokenData = response.data.data;
                
                // 토큰 저장
                if (tokenData.accessToken && tokenData.refreshToken) {
                    await authApi.setTokens(
                        tokenData.accessToken,
                        tokenData.refreshToken
                    );
                }
                
                // 사용자 정보 업데이트 (변경사항 반영)
                if (tokenData.memberInfo) {
                    await authApi.saveMemberInfo(tokenData.memberInfo);
                    store.dispatch(setMemberInfo(tokenData.memberInfo));
                    console.log("토큰 갱신 시 사용자 정보 업데이트:", tokenData.memberInfo);
                }
            }
            
            return response.data;
        } catch (error) {
            console.error("Token refresh error:", error);
            throw new Error("토큰 갱신에 실패했습니다");
        }
    },

    // 사용자 정보 관리 메서드들
    saveMemberInfo: async (memberInfo: MemberInfo): Promise<void> => {
        try {
            await SecureStore.setItemAsync(MEMBER_INFO_KEY, JSON.stringify(memberInfo));
        } catch (error) {
            console.error("사용자 정보 저장 실패:", error);
        }
    },

    getMemberInfo: async (): Promise<MemberInfo | null> => {
        try {
            const memberInfoString = await SecureStore.getItemAsync(MEMBER_INFO_KEY);
            return memberInfoString ? JSON.parse(memberInfoString) : null;
        } catch (error) {
            console.error("사용자 정보 조회 실패:", error);
            return null;
        }
    },

    clearAllStoredData: async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            await SecureStore.deleteItemAsync(MEMBER_INFO_KEY);
            
            // Redux 상태 초기화
            store.dispatch(clearAuth());
            
            console.log("모든 저장된 데이터 삭제 완료");
        } catch (error) {
            console.error("저장된 데이터 삭제 실패:", error);
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
