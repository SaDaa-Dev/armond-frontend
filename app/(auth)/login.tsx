import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button, Card, useTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { authApi } from "../../src/api/auth/authApi";

export default function Login() {
    const theme = useTheme();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            // 간단한 검증
            if (!phoneNumber || !password) {
                setError("전화번호와 비밀번호를 입력해주세요.");
                return;
            }

            const response = await authApi.login({
                phoneNumber,
                password,
            });

            if (response.data) {
                // 토큰 저장
                await authApi.setTokens(
                    response.data.accessToken || "",
                    response.data.refreshToken || ""
                );
                
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
                        onChangeText={setPhoneNumber}
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
                            onPress={() => router.push("/(auth)/signup" as any)}
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