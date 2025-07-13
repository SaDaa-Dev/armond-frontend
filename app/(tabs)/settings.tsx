import { getSpacing } from "@/utils/Theme";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { 
    Avatar, 
    Button, 
    Card, 
    Divider,
    IconButton,
    Text, 
    useTheme 
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "@/src/api/auth/authApi";
import { RootState } from "@/src/store/configureStore";
import { router } from "expo-router";

export default function Settings() {
    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    const { memberInfo, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)/login");
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "로그아웃",
                    style: "destructive",
                    onPress: performLogout,
                },
            ]
        );
    };

    const performLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authApi.logout();
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("로그아웃 오류:", error);
            Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getGenderText = (gender?: "MALE" | "FEMALE") => {
        if (gender === "MALE") return "남성";
        if (gender === "FEMALE") return "여성";
        return "미설정";
    };

    const getInitials = (name?: string, nickName?: string) => {
        const displayName = nickName || name;
        if (!displayName) return "사용자";
        return displayName.charAt(0).toUpperCase();
    };

    if (!memberInfo) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.centerContainer}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
                        사용자 정보를 불러올 수 없습니다.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* 헤더 */}
                <View style={styles.header}>
                    <Text 
                        variant="headlineMedium" 
                        style={[styles.headerTitle, { color: theme.colors.onBackground }]}
                    >
                        설정
                    </Text>
                </View>

                {/* 프로필 카드 */}
                <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
                    <Card.Content style={styles.profileContent}>
                        <View style={styles.profileHeader}>
                            <Avatar.Text 
                                size={80}
                                label={getInitials(memberInfo.name, memberInfo.nickName)}
                                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
                                labelStyle={{ color: theme.colors.onPrimary }}
                            />
                            <View style={styles.profileInfo}>
                                <Text 
                                    variant="headlineSmall" 
                                    style={[styles.profileName, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.nickName || memberInfo.name || "사용자"}
                                </Text>
                                <Text 
                                    variant="bodyMedium" 
                                    style={[styles.profilePhone, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    {memberInfo.phoneNumber}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* 개인 정보 카드 */}
                <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <Card.Content>
                        <Text 
                            variant="titleMedium" 
                            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
                        >
                            개인 정보
                        </Text>
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    이름
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.name || "미설정"}
                                </Text>
                            </View>
                            
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    닉네임
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.nickName || "미설정"}
                                </Text>
                            </View>
                        </View>

                        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    성별
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {getGenderText(memberInfo.gender)}
                                </Text>
                            </View>
                            
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    전화번호
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.phoneNumber || "미설정"}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* 신체 정보 카드 */}
                <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <Card.Content>
                        <Text 
                            variant="titleMedium" 
                            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
                        >
                            신체 정보
                        </Text>
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    키
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.height ? `${memberInfo.height}cm` : "미설정"}
                                </Text>
                            </View>
                            
                            <View style={styles.infoItem}>
                                <Text 
                                    variant="bodySmall" 
                                    style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                                >
                                    몸무게
                                </Text>
                                <Text 
                                    variant="bodyLarge" 
                                    style={[styles.infoValue, { color: theme.colors.onSurface }]}
                                >
                                    {memberInfo.weight ? `${memberInfo.weight}kg` : "미설정"}
                                </Text>
                            </View>
                        </View>

                        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

                        <View style={styles.infoItem}>
                            <Text 
                                variant="bodySmall" 
                                style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                            >
                                목표 칼로리
                            </Text>
                            <Text 
                                variant="bodyLarge" 
                                style={[styles.infoValue, { color: theme.colors.onSurface }]}
                            >
                                {memberInfo.goalCalories ? `${memberInfo.goalCalories}kcal` : "미설정"}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* 계정 관리 카드 */}
                <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <Card.Content>
                        <Text 
                            variant="titleMedium" 
                            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
                        >
                            계정 관리
                        </Text>
                        
                        <Button
                            mode="contained"
                            onPress={handleLogout}
                            loading={isLoggingOut}
                            disabled={isLoggingOut}
                            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
                            labelStyle={[styles.logoutButtonText, { color: theme.colors.onError }]}
                            icon="logout"
                        >
                            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                        </Button>
                    </Card.Content>
                </Card>

                {/* 하단 여백 */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: getSpacing("lg"),
    },
    header: {
        padding: getSpacing("lg"),
        paddingBottom: getSpacing("md"),
    },
    headerTitle: {
        fontWeight: "bold",
        textAlign: "center",
    },
    profileCard: {
        marginHorizontal: getSpacing("md"),
        marginBottom: getSpacing("md"),
    },
    profileContent: {
        padding: getSpacing("lg"),
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        marginRight: getSpacing("lg"),
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontWeight: "bold",
        marginBottom: getSpacing("xs"),
    },
    profilePhone: {
        opacity: 0.7,
    },
    infoCard: {
        marginHorizontal: getSpacing("md"),
        marginBottom: getSpacing("md"),
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: getSpacing("md"),
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoItem: {
        flex: 1,
        marginRight: getSpacing("sm"),
    },
    infoLabel: {
        marginBottom: getSpacing("xs"),
        fontWeight: "500",
    },
    infoValue: {
        fontWeight: "600",
    },
    divider: {
        marginVertical: getSpacing("md"),
    },
    logoutButton: {
        marginTop: getSpacing("sm"),
        paddingVertical: getSpacing("xs"),
    },
    logoutButtonText: {
        fontWeight: "bold",
    },
    bottomSpacer: {
        height: getSpacing("xl"),
    },
});