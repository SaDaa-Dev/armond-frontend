import { Platform } from "react-native";

// 개발 환경에서 사용할 IP 주소들
// 실제 개발 머신의 IP 주소로 변경하세요
const DEV_IPS = {
    // 로컬 개발 (시뮬레이터)
    localhost: "localhost",
    // 물리적 디바이스에서 사용할 개발 머신의 IP
    // 터미널에서 `ipconfig getifaddr en0` (Mac) 또는 `ipconfig` (Windows) 실행하여 확인
    localIP: "192.168.0.23", // 실제 IP 주소
    // Android 에뮬레이터
    androidEmulator: "10.0.2.2"
};

export const BASE_URL = __DEV__
    ? Platform.OS === "android"
        ? `http://${DEV_IPS.androidEmulator}:8080`
        : `http://${DEV_IPS.localIP}:8080` // 물리적 디바이스 대응
    : "https://api.example.com";

export const TEST_JWT_TOKEN = "";

// 디버깅을 위한 설정 출력
if (__DEV__) {
    console.log("🌐 API 설정:");
    console.log("- Platform:", Platform.OS);
    console.log("- BASE_URL:", BASE_URL);
    console.log("- 개발 중인 경우 실제 IP 주소를 확인하세요:");
    console.log("  Mac: ipconfig getifaddr en0");
    console.log("  Windows: ipconfig");
}
