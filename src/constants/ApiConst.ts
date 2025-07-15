import { Platform } from "react-native";

export const BASE_URL = __DEV__
    ? Platform.OS === "android"
        ? "http://10.0.2.2:8080" // Android 에뮬레이터는 10.0.2.2로 localhost 접근
        : "http://localhost:8080" // iOS 시뮬레이터는 localhost 사용
    : "https://api.example.com"; // TODO: AWS 배포 시 실제 API URL로 변경

export const TEST_JWT_TOKEN = "";

// 디버깅을 위한 설정 출력
if (__DEV__) {
    console.log("🌐 API 설정:");
    console.log("- Platform:", Platform.OS);
    console.log("- BASE_URL:", BASE_URL);
    console.log("- 개발 환경: localhost 기반");
}
