import { ErrorCode, ErrorInfo } from "@/src/api/errorTypes";

// 에러 코드별 정보 매핑
export const ERROR_MESSAGES: Record<ErrorCode, ErrorInfo> = {
    // 인증 관련 에러
    AUTH_001: {
        code: "AUTH_001",
        message: "사용자를 찾을 수 없습니다",
        userMessage: "아이디 또는 비밀번호를 확인해주세요",
    },
    AUTH_002: {
        code: "AUTH_002",
        message: "아이디 또는 비밀번호가 올바르지 않습니다",
        userMessage: "아이디 또는 비밀번호를 확인해주세요",
    },
    AUTH_003: {
        code: "AUTH_003",
        message: "토큰 생성에 실패했습니다",
        userMessage: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
    },
    AUTH_004: {
        code: "AUTH_004",
        message: "유효하지 않은 토큰입니다",
        userMessage: "로그인이 필요합니다",
        shouldLogout: true,
    },
    AUTH_005: {
        code: "AUTH_005",
        message: "만료된 토큰입니다",
        userMessage: "로그인이 필요합니다",
        shouldLogout: true,
    },
    AUTH_006: {
        code: "AUTH_006",
        message: "리프레시 토큰을 찾을 수 없습니다",
        userMessage: "로그인이 필요합니다",
        shouldLogout: true,
    },
    AUTH_007: {
        code: "AUTH_007",
        message: "리프레시 토큰이 일치하지 않습니다",
        userMessage: "로그인이 필요합니다",
        shouldLogout: true,
    },

    // 입력 검증 관련 에러
    VALID_001: {
        code: "VALID_001",
        message: "입력 검증에 실패했습니다",
        userMessage: "입력한 정보를 다시 확인해주세요",
    },
    VALID_002: {
        code: "VALID_002",
        message: "필수 입력값이 누락되었습니다",
        userMessage: "필수 입력 항목을 모두 입력해주세요",
    },
    VALID_003: {
        code: "VALID_003",
        message: "입력값 형식이 올바르지 않습니다",
        userMessage: "올바른 형식으로 입력해주세요",
    },
    VALID_004: {
        code: "VALID_004",
        message: "전화번호 형식이 올바르지 않습니다",
        userMessage: "올바른 전화번호 형식으로 입력해주세요",
    },
    VALID_005: {
        code: "VALID_005",
        message: "비밀번호가 보안 요구사항을 만족하지 않습니다",
        userMessage:
            "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다",
    },

    // 회원 관리 관련 에러
    MEMBER_001: {
        code: "MEMBER_001",
        message: "이미 등록된 회원입니다",
        userMessage: "이미 가입된 계정입니다. 로그인을 시도해주세요",
    },
    MEMBER_002: {
        code: "MEMBER_002",
        message: "이미 사용 중인 닉네임입니다",
        userMessage: "다른 닉네임을 사용해주세요",
    },
    MEMBER_003: {
        code: "MEMBER_003",
        message: "이미 사용 중인 이메일입니다",
        userMessage: "다른 이메일 주소를 사용해주세요",
    },
    MEMBER_004: {
        code: "MEMBER_004",
        message: "이미 사용 중인 전화번호입니다",
        userMessage: "다른 전화번호를 사용해주세요",
    },
    MEMBER_005: {
        code: "MEMBER_005",
        message: "회원 정보를 찾을 수 없습니다",
        userMessage: "회원 정보를 찾을 수 없습니다",
    },
    MEMBER_006: {
        code: "MEMBER_006",
        message: "비활성화된 회원입니다",
        userMessage: "계정이 비활성화되었습니다. 고객센터에 문의해주세요",
    },

    // 운동 관련 에러
    WORKOUT_001: {
        code: "WORKOUT_001",
        message: "운동 정보를 찾을 수 없습니다",
        userMessage: "운동 정보를 찾을 수 없습니다",
    },
    WORKOUT_002: {
        code: "WORKOUT_002",
        message: "이미 완료된 운동입니다",
        userMessage: "이미 완료된 운동입니다",
    },
    WORKOUT_003: {
        code: "WORKOUT_003",
        message: "유효하지 않은 운동 세트입니다",
        userMessage: "운동 세트 정보가 올바르지 않습니다",
    },

    // 루틴 관련 에러
    ROUTINE_001: {
        code: "ROUTINE_001",
        message: "루틴을 찾을 수 없습니다",
        userMessage: "루틴을 찾을 수 없습니다",
    },
    ROUTINE_002: {
        code: "ROUTINE_002",
        message: "루틴에 접근할 권한이 없습니다",
        userMessage: "이 루틴에 접근할 권한이 없습니다",
    },
    ROUTINE_003: {
        code: "ROUTINE_003",
        message: "이미 사용 중인 루틴 이름입니다",
        userMessage: "다른 루틴 이름을 사용해주세요",
    },

    // 운동 종목 관련 에러
    EXERCISE_001: {
        code: "EXERCISE_001",
        message: "운동 종목을 찾을 수 없습니다",
        userMessage: "운동 종목을 찾을 수 없습니다",
    },
    EXERCISE_002: {
        code: "EXERCISE_002",
        message: "운동 부위 정보를 찾을 수 없습니다",
        userMessage: "운동 부위 정보를 찾을 수 없습니다",
    },

    // 시스템 에러
    SYS_001: {
        code: "SYS_001",
        message: "서버 내부 오류가 발생했습니다",
        userMessage: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요",
    },
    SYS_002: {
        code: "SYS_002",
        message: "데이터베이스 오류가 발생했습니다",
        userMessage: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
    },
    SYS_003: {
        code: "SYS_003",
        message: "외부 API 호출에 실패했습니다",
        userMessage:
            "외부 서비스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요",
    },
    SYS_004: {
        code: "SYS_004",
        message: "파일 업로드에 실패했습니다",
        userMessage: "파일 업로드에 실패했습니다. 다시 시도해주세요",
    },
    SYS_005: {
        code: "SYS_005",
        message: "시스템 점검 중입니다",
        userMessage: "시스템 점검 중입니다. 잠시 후 다시 시도해주세요",
    },

    // 일반적인 에러
    COMMON_001: {
        code: "COMMON_001",
        message: "예기치 못한 오류가 발생했습니다",
        userMessage:
            "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
    },
    COMMON_002: {
        code: "COMMON_002",
        message: "잘못된 요청입니다",
        userMessage: "잘못된 요청입니다. 다시 시도해주세요",
    },
    COMMON_003: {
        code: "COMMON_003",
        message: "접근이 거부되었습니다",
        userMessage: "접근 권한이 없습니다",
    },
    COMMON_004: {
        code: "COMMON_004",
        message: "요청한 리소스를 찾을 수 없습니다",
        userMessage: "요청한 정보를 찾을 수 없습니다",
    },
};

// 에러 코드로 에러 정보 가져오기
export function getErrorInfo(errorCode: ErrorCode): ErrorInfo {
    return ERROR_MESSAGES[errorCode];
}

// 에러 카테고리 확인 함수들
export function isAuthError(errorCode: string): boolean {
    return errorCode.startsWith("AUTH_");
}

export function isValidationError(errorCode: string): boolean {
    return errorCode.startsWith("VALID_");
}

export function isMemberError(errorCode: string): boolean {
    return errorCode.startsWith("MEMBER_");
}

export function isSystemError(errorCode: string): boolean {
    return errorCode.startsWith("SYS_") || errorCode.startsWith("COMMON_");
}

// 에러 코드가 로그아웃을 필요로 하는지 확인
export function shouldLogoutForError(errorCode: ErrorCode): boolean {
    const errorInfo = getErrorInfo(errorCode);
    return errorInfo.shouldLogout === true;
}

// 사용자에게 보여줄 에러 메시지 가져오기
export function getUserMessage(
    errorCode: ErrorCode,
    fallbackMessage?: string
): string {
    const errorInfo = getErrorInfo(errorCode);
    return errorInfo.userMessage || fallbackMessage || "오류가 발생했습니다";
}
