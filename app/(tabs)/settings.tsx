import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Card, Avatar, Divider, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import { authApi } from "../../src/api/auth/authApi";
import * as SecureStore from "expo-secure-store";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export default function Settings() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            "로그아웃", 
            "정말 로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "로그아웃",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await authApi.logout();
                            // 로그인 화면으로 이동
                            router.replace("/(auth)/login");
                        } catch (error) {
                            console.error("로그아웃 에러:", error);
                            Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.headerTitle}>설정</Text>
            </View>
            
            <Card style={styles.profileCard}>
                <Card.Content style={styles.profileContent}>
                    <Avatar.Icon size={80} icon="account" style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text variant="titleLarge">사용자</Text>
                        <Text variant="bodyMedium" style={styles.subText}>010-0000-0000</Text>
                    </View>
                </Card.Content>
            </Card>
            
            <Card style={styles.settingsCard}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>계정</Text>
                    <Divider style={styles.divider} />
                    
                    <Button 
                        mode="outlined" 
                        style={[styles.button, { borderColor: theme.colors.error }]} 
                        textColor={theme.colors.error}
                        onPress={handleLogout}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        로그아웃
                    </Button>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontWeight: "bold",
        color: "white",
    },
    profileCard: {
        marginBottom: 16,
        borderRadius: 12,
    },
    profileContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    avatar: {
        marginRight: 16,
        backgroundColor: "#7E57C2",
    },
    profileInfo: {
        flex: 1,
    },
    subText: {
        opacity: 0.7,
        marginTop: 4,
    },
    settingsCard: {
        borderRadius: 12,
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: 8,
    },
    divider: {
        marginBottom: 16,
    },
    button: {
        marginVertical: 8,
    }
});
