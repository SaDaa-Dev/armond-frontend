import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme, Menu } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WorkoutHeader() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleCustomExerciseAdd = () => {
        setMenuVisible(false);
        // 커스텀 운동 등록 모달 열기
        console.log('커스텀 운동 등록');
    };

    const handleWorkoutSettings = () => {
        setMenuVisible(false);
        // 운동 설정 화면 열기
        console.log('운동 설정');
    };

    const handleWorkoutHistory = () => {
        setMenuVisible(false);
        // 운동 기록 화면 열기
        console.log('운동 기록');
    };

    const handleRoutineManagement = () => {
        setMenuVisible(false);
        // 루틴 관리 화면 열기
        console.log('루틴 관리');
    };

    return (
        <View style={[
            styles.headerContainer,
            { 
                backgroundColor: theme.colors.surface,
                paddingTop: insets.top, // Safe Area 처리
                borderBottomColor: theme.colors.outline,
            }
        ]}>
            <View style={styles.headerContent}>
                <View>
                    <Text variant="headlineSmall" style={{ 
                        color: theme.colors.onSurface,
                        fontWeight: 'bold'
                    }}>
                        💪 운동
                    </Text>
                    <Text variant="bodySmall" style={{ 
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 2
                    }}>
                        나만의 운동을 관리하세요
                    </Text>
                </View>
                
                <View style={styles.headerActions}>
                    {/* 운동 기록 바로가기 */}
                    <IconButton
                        icon="history"
                        size={24}
                        iconColor={theme.colors.primary}
                        onPress={handleWorkoutHistory}
                    />
                    
                    {/* 더보기 메뉴 */}
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                size={24}
                                iconColor={theme.colors.primary}
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                        contentStyle={{
                            backgroundColor: theme.colors.surface,
                        }}
                    >
                        <Menu.Item
                            leadingIcon="plus"
                            onPress={handleCustomExerciseAdd}
                            title="커스텀 운동 추가"
                        />
                        <Menu.Item
                            leadingIcon="playlist-edit"
                            onPress={handleRoutineManagement}
                            title="루틴 관리"
                        />
                        <Menu.Item
                            leadingIcon="cog"
                            onPress={handleWorkoutSettings}
                            title="운동 설정"
                        />
                    </Menu>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 1,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});