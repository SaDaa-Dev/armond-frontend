// 백엔드 에러 코드 타입 정의
export type ErrorCode =
    // 인증 관련 에러
    | "AUTH_001"
    | "AUTH_002"
    | "AUTH_003"
    | "AUTH_004"
    | "AUTH_005"
    | "AUTH_006"
    | "AUTH_007"
    // 입력 검증 관련 에러
    | "VALID_001"
    | "VALID_002"
    | "VALID_003"
    | "VALID_004"
    | "VALID_005"
    // 회원 관리 관련 에러
    | "MEMBER_001"
    | "MEMBER_002"
    | "MEMBER_003"
    | "MEMBER_004"
    | "MEMBER_005"
    | "MEMBER_006"
    // 운동 관련 에러
    | "WORKOUT_001"
    | "WORKOUT_002"
    | "WORKOUT_003"
    // 루틴 관련 에러
    | "ROUTINE_001"
    | "ROUTINE_002"
    | "ROUTINE_003"
    // 운동 종목 관련 에러
    | "EXERCISE_001"
    | "EXERCISE_002"
    // 시스템 에러
    | "SYS_001"
    | "SYS_002"
    | "SYS_003"
    | "SYS_004"
    | "SYS_005"
    // 일반적인 에러
    | "COMMON_001"
    | "COMMON_002"
    | "COMMON_003"
    | "COMMON_004";

// 백엔드 에러 응답 구조
export interface ApiErrorResponse {
    status: "fail" | "error";
    message: string;
    data: null;
    error?: string;
    errorCode?: ErrorCode;
}

// 백엔드 성공 응답 구조
export interface ApiSuccessResponse<T = any> {
    status: "success";
    message: string;
    data: T;
    error?: null;
    errorCode?: null;
}

// 통합 API 응답 타입
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// 에러 처리용 타입
export interface ErrorInfo {
    code: ErrorCode;
    message: string;
    userMessage: string;
    shouldLogout?: boolean;
    shouldRedirect?: string;
}
