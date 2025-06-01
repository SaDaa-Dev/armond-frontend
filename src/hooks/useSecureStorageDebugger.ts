import { useState, useEffect, useCallback } from "react";
import { secureStorageDebugger } from "../services/secureStorageDebugger";

export interface SecureStorageDebugState {
    data: Record<string, string | null>;
    isLoading: boolean;
    lastUpdated: Date | null;
}

export const useSecureStorageDebugger = (autoRefresh = false, refreshInterval = 5000) => {
    const [state, setState] = useState<SecureStorageDebugState>({
        data: {},
        isLoading: false,
        lastUpdated: null,
    });

    const refresh = useCallback(async () => {
        if (!__DEV__) return;
        
        setState(prev => ({ ...prev, isLoading: true }));
        
        try {
            await secureStorageDebugger.refreshData();
            const data = secureStorageDebugger.getCurrentData();
            setState({
                data,
                isLoading: false,
                lastUpdated: new Date(),
            });
        } catch (error) {
            console.error("Failed to refresh secure storage data:", error);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const logToConsole = useCallback(async () => {
        if (!__DEV__) return;
        await secureStorageDebugger.logCurrentState();
    }, []);

    const showAlert = useCallback(async () => {
        if (!__DEV__) return;
        await secureStorageDebugger.showAlert();
    }, []);

    const clearAll = useCallback(async () => {
        if (!__DEV__) return;
        await secureStorageDebugger.clearAll();
    }, []);

    const deleteKey = useCallback(async (keyName: string) => {
        if (!__DEV__) return;
        await secureStorageDebugger.deleteKey(keyName as any);
    }, []);

    useEffect(() => {
        if (!__DEV__) return;

        // 구독 시작
        const unsubscribe = secureStorageDebugger.subscribe((data) => {
            setState(prev => ({
                ...prev,
                data,
                lastUpdated: new Date(),
            }));
        });

        // 초기 로드
        refresh();

        return unsubscribe;
    }, [refresh]);

    useEffect(() => {
        if (!__DEV__ || !autoRefresh) return;

        const interval = setInterval(refresh, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, refresh]);

    return {
        ...state,
        refresh,
        logToConsole,
        showAlert,
        clearAll,
        deleteKey,
    };
}; 