declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REACT_DEVTOOLS_PORT__?: number;
  }
}

import React from 'react';
import { Slot, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '@/src/store';

// React Native Debugger 설정
if (__DEV__) {
  // @ts-ignore
  global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
  // @ts-ignore
  global.FormData = global.originalFormData || global.FormData;

  // React Native Debugger 포트 설정
  // @ts-ignore
  window.__REACT_DEVTOOLS_PORT__ = 19000;
}

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#1E1E1E',    // 전체 배경 (차콜 그레이)
    surface: '#2B2B2B',      // 카드 배경 (밝은 차콜)
    primary: '#9C27B0',      // 메인 색상 (진한 퍼플)
    secondary: '#7E57C2',    // 보조 색상 (밝은 퍼플)
    tertiary: '#8A2BE2',     // 추가 강조 색상 (블루 바이올렛)
    elevation: {
      level0: '#1E1E1E',     // 기본 배경
      level1: '#2B2B2B',     // 카드, 탭바 등의 배경
      level2: '#323232',     // 살짝 더 밝은 요소
      level3: '#383838',     // 호버/프레스 상태
      level4: '#3F3F3F',     // 모달/다이얼로그
      level5: '#454545',     // 최상위 요소
    },
  },
};

export default function RootLayout() {
  const isAuthenticated = true;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar 
          style="light"
          backgroundColor="#1E1E1E"
          translucent={false}
        />
        <PaperProvider theme={darkTheme}>
          <Stack>
            {!isAuthenticated ? (
              <Stack.Screen
                name="(auth)/login"
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
            )}
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}