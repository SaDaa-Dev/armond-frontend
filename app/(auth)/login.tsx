import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { authApi } from "../../src/api/auth/authApi";
import { components } from "../../src/api/api-types";

type LoginRequestDto = components["schemas"]["LoginRequestDto"];

export default function Login() {
    const theme = useTheme();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    // 전화번호 형식 자동 변환 (000-0000-0000)
    const formatPhoneNumber = (text: string) => {
        // 숫자만 남기고 모든 문자 제거
        const cleaned = text.replace(/\D/g, "");
        let formatted = cleaned;
        
        // 입력된 번호가 '010'으로 시작하지 않으면, '0'으로 시작하는지 확인하고 아니면 '0'을 추가
        const ensureStartsWithZero = cleaned.startsWith("0") ? cleaned : "0" + cleaned;
        
        if (ensureStartsWithZero.length > 3 && ensureStartsWithZero.length <= 7) {
            formatted = `${ensureStartsWithZero.slice(0, 3)}-${ensureStartsWithZero.slice(3)}`;
        } else if (ensureStartsWithZero.length > 7) {
            formatted = `${ensureStartsWithZero.slice(0, 3)}-${ensureStartsWithZero.slice(3, 7)}-${ensureStartsWithZero.slice(7, 11)}`;
        } else {
            formatted = ensureStartsWithZero;
        }
        
        return formatted;
    };

    const handleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            // 간단한 검증
            if (!phoneNumber || !password) {
                setError("전화번호와 비밀번호를 입력해주세요.");
                setIsLoading(false);
                return;
            }

            // 휴대폰 번호에서 하이픈(-) 제거하고 앞에 0이 있는지 확인
            let cleanedPhoneNumber = phoneNumber.replace(/-/g, "");
            
            // 전화번호가 0으로 시작하는지 확인, 아니면 0 추가
            if (!cleanedPhoneNumber.startsWith("0")) {
                cleanedPhoneNumber = "0" + cleanedPhoneNumber;
            }

            console.log("로그인 요청 전화번호:", cleanedPhoneNumber);

            const response = await authApi.login({
                memberName: cleanedPhoneNumber,
                password,
            } as LoginRequestDto);

            if (response.data) {
                console.log("로그인 성공! 사용자 정보:", response.data.memberInfo);
                // 메인 화면으로 리다이렉트
                router.replace("/(tabs)");
            } else {
                setError(response.error || "로그인에 실패했습니다.");
            }
        } catch (error) {
            setError("로그인 중 오류가 발생했습니다.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.title}>아몬드</Text>
                <Text style={styles.subtitle}>운동 기록을 더 쉽게</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Text variant="titleLarge" style={styles.cardTitle}>
                        로그인
                    </Text>

                    <TextInput
                        label="전화번호"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="phone-pad"
                        placeholder="010-0000-0000"
                    />

                    <TextInput
                        label="비밀번호"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        mode="outlined"
                    />

                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    >
                        로그인
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text>계정이 없으신가요?</Text>
                        <Button
                            mode="text"
                            onPress={() => router.push("/(auth)/register" as any)}
                            compact
                        >
                            회원가입
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.7)",
    },
    card: {
        borderRadius: 12,
    },
    cardContent: {
        padding: 8,
    },
    cardTitle: {
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    errorText: {
        color: "red",
        marginBottom: 8,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
});
