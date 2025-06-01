import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

// 디버깅할 키들 정의
const DEBUG_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    // 다른 키들도 추가 가능
};

// 개발 환경에서만 디버깅 활성화
const IS_DEV = __DEV__;

export class SecureStorageDebugger {
    private static instance: SecureStorageDebugger;
    private storageData: Record<string, string | null> = {};
    private subscribers: Array<(data: Record<string, string | null>) => void> = [];

    private constructor() {}

    static getInstance(): SecureStorageDebugger {
        if (!SecureStorageDebugger.instance) {
            SecureStorageDebugger.instance = new SecureStorageDebugger();
        }
        return SecureStorageDebugger.instance;
    }

    /**
     * 모든 키의 값을 가져와서 저장
     */
    async refreshData(): Promise<void> {
        if (!IS_DEV) return;

        const newData: Record<string, string | null> = {};
        
        for (const [keyName, keyValue] of Object.entries(DEBUG_KEYS)) {
            try {
                const value = await SecureStore.getItemAsync(keyValue);
                newData[keyName] = value;
            } catch (error) {
                newData[keyName] = `Error: ${error}`;
            }
        }

        this.storageData = newData;
        this.notifySubscribers();
    }

    /**
     * 구독자들에게 변경사항 알림
     */
    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.storageData));
    }

    /**
     * 변경사항 구독
     */
    subscribe(callback: (data: Record<string, string | null>) => void): () => void {
        this.subscribers.push(callback);
        
        // 초기 데이터 제공
        callback(this.storageData);
        
        // 구독 해제 함수 반환
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    /**
     * 현재 저장된 데이터 반환
     */
    getCurrentData(): Record<string, string | null> {
        return this.storageData;
    }

    /**
     * 콘솔에 현재 상태 출력
     */
    async logCurrentState(): Promise<void> {
        if (!IS_DEV) return;

        await this.refreshData();
        
        console.log("=== Secure Storage Debug Info ===");
        console.log(`Timestamp: ${new Date().toISOString()}`);
        
        Object.entries(this.storageData).forEach(([key, value]) => {
            if (value) {
                // 토큰의 경우 앞뒤 몇 글자만 표시
                const displayValue = value.length > 10 
                    ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
                    : value;
                console.log(`${key}: ${displayValue}`);
            } else {
                console.log(`${key}: null`);
            }
        });
        
        console.log("================================");
    }

    /**
     * Alert으로 현재 상태 표시
     */
    async showAlert(): Promise<void> {
        if (!IS_DEV) return;

        await this.refreshData();
        
        const message = Object.entries(this.storageData)
            .map(([key, value]) => {
                if (value) {
                    const displayValue = value.length > 20
                        ? `${value.substring(0, 20)}...`
                        : value;
                    return `${key}: ${displayValue}`;
                } else {
                    return `${key}: null`;
                }
            })
            .join('\n');

        Alert.alert(
            "Secure Storage Debug",
            message || "No data found",
            [{ text: "OK" }]
        );
    }

    /**
     * 특정 키의 값 삭제
     */
    async deleteKey(keyName: keyof typeof DEBUG_KEYS): Promise<void> {
        if (!IS_DEV) return;

        try {
            await SecureStore.deleteItemAsync(DEBUG_KEYS[keyName]);
            console.log(`Deleted ${keyName} from secure storage`);
            await this.refreshData();
        } catch (error) {
            console.error(`Error deleting ${keyName}:`, error);
        }
    }

    /**
     * 모든 키 삭제
     */
    async clearAll(): Promise<void> {
        if (!IS_DEV) return;

        try {
            for (const keyValue of Object.values(DEBUG_KEYS)) {
                await SecureStore.deleteItemAsync(keyValue);
            }
            console.log("Cleared all secure storage data");
            await this.refreshData();
        } catch (error) {
            console.error("Error clearing secure storage:", error);
        }
    }
}

// 전역 디버거 인스턴스
export const secureStorageDebugger = SecureStorageDebugger.getInstance();

// 개발 환경에서 전역 객체에 디버거 노출
if (IS_DEV) {
    (global as any).secureStorageDebugger = secureStorageDebugger;
} 