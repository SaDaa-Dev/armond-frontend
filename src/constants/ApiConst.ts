import { Platform } from "react-native";

export const BASE_URL = __DEV__
    ? Platform.OS === "android"
        ? "http://10.0.2.2:8080"
        : "http://localhost:8080"
    : "https://api.example.com";

export const TEST_JWT_TOKEN = "";
