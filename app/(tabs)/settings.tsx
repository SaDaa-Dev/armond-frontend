import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, Card, Avatar, Divider, List, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import { authApi } from "../../src/api/auth/authApi";
import { useThemeContext, type ThemeMode } from "@/src/contexts/ThemeContext";
import { getSpacing, getRadius, getShadow } from "@/utils/Theme";
import { useColorScheme } from "react-native";

export default function Settings() {
    const [isLoading, setIsLoading] = useState(false);
    const { themeMode, setThemeMode, isDark } = useThemeContext();
    const theme = useTheme();
    const systemColorScheme = useColorScheme();

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

    const handleThemeChange = async (mode: ThemeMode) => {
        console.log('🎨 설정 화면에서 테마 변경 시도:', mode);
        await setThemeMode(mode);
        console.log('🎨 설정 화면에서 테마 변경 완료:', mode);
    };

    const getThemeDisplayName = (mode: ThemeMode) => {
        switch (mode) {
            case 'light':
                return '라이트 모드';
            case 'dark':
                return '다크 모드';
            case 'system':
                return '시스템 설정';
            default:
                return '시스템 설정';
        }
    };

    const getThemeIcon = (mode: ThemeMode) => {
        switch (mode) {
            case 'light':
                return 'weather-sunny';
            case 'dark':
                return 'weather-night';
            case 'system':
                return 'cellphone-cog';
            default:
                return 'cellphone-cog';
        }
    };

    return (
        <SafeAreaView style={[
            styles.container,
            { backgroundColor: theme.colors.background }
        ]}>
            <View style={styles.header}>
                <Text 
                    variant="headlineMedium" 
                    style={[
                        styles.headerTitle,
                        { color: theme.colors.onBackground }
                    ]}
                >
                    설정
                </Text>
            </View>
            
            <Card style={[
                styles.profileCard,
                { backgroundColor: theme.colors.surface }
            ]}>
                <Card.Content style={styles.profileContent}>
                    <Avatar.Icon 
                        size={80} 
                        icon="account" 
                        style={[
                            styles.avatar,
                            { backgroundColor: theme.colors.primary }
                        ]} 
                    />
                    <View style={styles.profileInfo}>
                        <Text 
                            variant="titleLarge"
                            style={{ color: theme.colors.onSurface }}
                        >
                            사용자
                        </Text>
                        <Text 
                            variant="bodyMedium" 
                            style={[
                                styles.subText,
                                { color: theme.colors.onSurfaceVariant }
                            ]}
                        >
                            010-0000-0000
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            {/* 디버깅 정보 카드 */}
            <Card style={[
                styles.settingsCard,
                { backgroundColor: theme.colors.surface }
            ]}>
                <Card.Content>
                    <Text 
                        variant="titleMedium" 
                        style={[
                            styles.sectionTitle,
                            { color: theme.colors.onSurface }
                        ]}
                    >
                        🐛 디버깅 정보
                    </Text>
                    <Divider style={[
                        styles.divider,
                        { backgroundColor: theme.colors.outline }
                    ]} />
                    
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        현재 테마 모드: {themeMode}
                    </Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        시스템 테마: {systemColorScheme}
                    </Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        다크 모드 활성화: {isDark ? '예' : '아니오'}
                    </Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        현재 배경색: {theme.colors.background}
                    </Text>
                </Card.Content>
            </Card>

            {/* 테마 설정 카드 */}
            <Card style={[
                styles.settingsCard,
                { backgroundColor: theme.colors.surface }
            ]}>
                <Card.Content>
                    <Text 
                        variant="titleMedium" 
                        style={[
                            styles.sectionTitle,
                            { color: theme.colors.onSurface }
                        ]}
                    >
                        화면 설정
                    </Text>
                    <Divider style={[
                        styles.divider,
                        { backgroundColor: theme.colors.outline }
                    ]} />
                    
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
                            테마 모드
                        </List.Subheader>
                        {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                            <List.Item
                                key={mode}
                                title={getThemeDisplayName(mode)}
                                description={
                                    mode === 'system' 
                                        ? '시스템 설정을 따릅니다' 
                                        : `앱을 ${getThemeDisplayName(mode)}로 표시합니다`
                                }
                                left={(props) => (
                                    <List.Icon 
                                        {...props} 
                                        icon={getThemeIcon(mode)}
                                        color={theme.colors.onSurface}
                                    />
                                )}
                                right={(props) => (
                                    themeMode === mode ? (
                                        <List.Icon 
                                            {...props} 
                                            icon="check" 
                                            color={theme.colors.primary}
                                        />
                                    ) : null
                                )}
                                onPress={() => handleThemeChange(mode)}
                                style={[
                                    styles.themeOption,
                                    themeMode === mode && {
                                        backgroundColor: theme.colors.primary + '20'
                                    }
                                ]}
                            />
                        ))}
                    </List.Section>
                </Card.Content>
            </Card>
            
            <Card style={[
                styles.settingsCard,
                { backgroundColor: theme.colors.surface }
            ]}>
                <Card.Content>
                    <Text 
                        variant="titleMedium" 
                        style={[
                            styles.sectionTitle,
                            { color: theme.colors.onSurface }
                        ]}
                    >
                        계정
                    </Text>
                    <Divider style={[
                        styles.divider,
                        { backgroundColor: theme.colors.outline }
                    ]} />
                    
                    <Button 
                        mode="outlined" 
                        style={[
                            styles.button,
                            { borderColor: theme.colors.error }
                        ]} 
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
        padding: getSpacing('md'),
    },
    header: {
        marginBottom: getSpacing('lg'),
    },
    headerTitle: {
        fontWeight: "bold",
    },
    profileCard: {
        marginBottom: getSpacing('md'),
        borderRadius: getRadius('lg'),
        ...getShadow('sm'),
    },
    profileContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: getSpacing('sm'),
    },
    avatar: {
        marginRight: getSpacing('md'),
    },
    profileInfo: {
        flex: 1,
    },
    subText: {
        opacity: 0.7,
        marginTop: getSpacing('xs'),
    },
    settingsCard: {
        marginBottom: getSpacing('md'),
        borderRadius: getRadius('lg'),
        ...getShadow('sm'),
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: getSpacing('sm'),
    },
    divider: {
        marginBottom: getSpacing('md'),
    },
    themeOption: {
        borderRadius: getRadius('md'),
        marginVertical: getSpacing('xs'),
    },
    button: {
        marginVertical: getSpacing('sm'),
    }
});
