import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#121212',    // 전체 배경 (검정)
    surface: '#1E1E1E',      // 카드 배경 (진한 회색)
    primary: '#2196F3',      // 메인 색상 (파란색)
    secondary: '#64B5F6',    // 보조 색상 (밝은 파란색)
    elevation: {
      level0: '#121212',
      level1: '#1E1E1E',     // 카드 배경
      level2: '#232323',     // 살짝 더 밝은 회색
      level3: '#252525',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={darkTheme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}