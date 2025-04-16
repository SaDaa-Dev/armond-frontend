import axios from "axios";

import { AxiosRequestConfig, Method } from "axios";

import { AxiosInstance } from "axios";
import { BASE_URL } from "../constants/ApiConst";
import { navigateToInitialScreen } from "./axiosService";
import { Alert } from "react-native";


// axios 인스턴스 확장
export const createApiClient = (): AxiosInstance & {
    requestWithMethod: (
        method: Method,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ) => Promise<any>;
} => {
    const instance = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
        timeout: 10000,
    });

    // 요청 인터셉터 설정
    instance.interceptors.request.use(
        (config) => {
            // 요청 전에 처리
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터 설정
    instance.interceptors.response.use(
        (response) => {
            // 응답 시 처리
            return response;
        },
        (error) => {
            // 서버 다운 또는 네트워크 에러 처리
            if (!error.response || error.code === "ECONNABORTED") {
                // 서버가 응답하지 않는 경우 (다운 또는 타임아웃)
                Alert.alert(
                    "서버 연결 오류",
                    "서버에 연결할 수 없습니다. 초기 화면으로 이동합니다.",
                    [
                        {
                            text: "확인",
                            onPress: () => {
                                navigateToInitialScreen();
                            },
                        },
                    ]
                );
            }
            return Promise.reject(error);
        }
    );

    // method를 쉽게 변경할 수 있는 함수 추가
    const requestWithMethod = async (
        method: Method,
        url: string,
        data?: any,
        config: AxiosRequestConfig = {}
    ) => {
        return instance.request({
            method,
            url,
            data,
            ...config,
        });
    };

    // instance에 함수 추가
    (instance as any).requestWithMethod = requestWithMethod;

    return instance as any;
};