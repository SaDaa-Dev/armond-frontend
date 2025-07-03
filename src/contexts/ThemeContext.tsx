import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [isLoading, setIsLoading] = useState(true);
    const systemColorScheme = useColorScheme();

    // 시스템 테마와 사용자 설정을 조합하여 실제 테마 결정
    const isDark = themeMode === 'system' 
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    // 디버깅 로그 추가
    useEffect(() => {
        console.log('🎨 테마 상태 변경:', {
            themeMode,
            systemColorScheme,
            isDark,
            isLoading
        });
    }, [themeMode, systemColorScheme, isDark, isLoading]);

    // 앱 시작 시 저장된 테마 설정 불러오기
    useEffect(() => {
        const loadThemeMode = async () => {
            try {
                console.log('📱 저장된 테마 설정 불러오기 시작');
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                console.log('📱 저장된 테마 설정:', savedMode);
                
                if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                    setThemeModeState(savedMode as ThemeMode);
                    console.log('📱 테마 설정 적용:', savedMode);
                }
            } catch (error) {
                console.error('❌ 테마 설정 불러오기 실패:', error);
            } finally {
                setIsLoading(false);
                console.log('📱 테마 로딩 완료');
            }
        };

        loadThemeMode();
    }, []);

    // 테마 설정 변경 및 저장
    const setThemeMode = async (mode: ThemeMode) => {
        try {
            console.log('🎨 테마 변경 시작:', mode);
            setThemeModeState(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            console.log('✅ 테마 변경 및 저장 완료:', mode);
        } catch (error) {
            console.error('❌ 테마 설정 저장 실패:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{
            themeMode,
            setThemeMode,
            isDark,
            isLoading,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}; 