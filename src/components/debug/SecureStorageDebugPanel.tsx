import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
} from "react-native";
import { secureStorageDebugger } from "../../services/secureStorageDebugger";

interface SecureStorageDebugPanelProps {
    visible: boolean;
    onClose: () => void;
}

export const SecureStorageDebugPanel: React.FC<SecureStorageDebugPanelProps> = ({
    visible,
    onClose,
}) => {
    const [storageData, setStorageData] = useState<Record<string, string | null>>({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (!visible) return;

        // 구독 시작
        const unsubscribe = secureStorageDebugger.subscribe(setStorageData);
        
        // 초기 데이터 로드
        handleRefresh();

        return unsubscribe;
    }, [visible]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await secureStorageDebugger.refreshData();
        setIsRefreshing(false);
    };

    const handleDeleteKey = (keyName: string) => {
        Alert.alert(
            "키 삭제",
            `${keyName}을(를) 삭제하시겠습니까?`,
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => {
                        secureStorageDebugger.deleteKey(keyName as any);
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "모든 데이터 삭제",
            "모든 Secure Storage 데이터를 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => {
                        secureStorageDebugger.clearAll();
                    },
                },
            ]
        );
    };

    const formatValue = (value: string | null): string => {
        if (!value) return "null";
        if (value.length > 50) {
            return `${value.substring(0, 25)}...${value.substring(value.length - 25)}`;
        }
        return value;
    };

    const getValueColor = (value: string | null): string => {
        if (!value) return "#666";
        if (value.startsWith("Error:")) return "#ff4444";
        return "#00aa00";
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Secure Storage Debug</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        style={[styles.button, styles.refreshButton]}
                        disabled={isRefreshing}
                    >
                        <Text style={styles.buttonText}>
                            {isRefreshing ? "새로고침 중..." : "새로고침"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={[styles.button, styles.clearButton]}
                    >
                        <Text style={styles.buttonText}>모두 삭제</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.info}>
                        <Text style={styles.infoText}>
                            마지막 업데이트: {new Date().toLocaleTimeString()}
                        </Text>
                    </View>

                    {Object.entries(storageData).map(([key, value]) => (
                        <View key={key} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.keyText}>{key}</Text>
                                <TouchableOpacity
                                    onPress={() => handleDeleteKey(key)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                            <Text 
                                style={[styles.valueText, { color: getValueColor(value) }]}
                                selectable
                            >
                                {formatValue(value)}
                            </Text>
                        </View>
                    ))}

                    {Object.keys(storageData).length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                저장된 데이터가 없습니다.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        color: "#666",
    },
    controls: {
        flexDirection: "row",
        padding: 16,
        gap: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        flex: 1,
    },
    refreshButton: {
        backgroundColor: "#007AFF",
    },
    clearButton: {
        backgroundColor: "#FF3B30",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    info: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoText: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    item: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    keyText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    valueText: {
        fontSize: 12,
        fontFamily: "monospace",
        lineHeight: 16,
    },
    emptyState: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
}); 