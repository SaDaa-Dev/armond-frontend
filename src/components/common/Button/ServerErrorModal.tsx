import { router } from "expo-router";
import { Alert, BackHandler, Platform } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

interface ServerErrorModalProps {
    serverError: boolean;
}

export default function ServerErrorModal({ serverError }: ServerErrorModalProps) {

    const handleAppReset = () => {
        Alert.alert(
            "서버 연결 오류",
            "서버가 불안정합니다. 앱을 다시 시작해주세요.",
            [
                {
                    text: "확인",
                    onPress: () => {
                        if (Platform.OS === "android") {
                            BackHandler.exitApp();
                        } else {
                            router.replace("/(auth)/login");
                        }
                    }
                }
            ]
        );
    }

    return (
        <Modal  
            visible={serverError}
            contentContainerStyle={{
                backgroundColor: "#2B2B2B",
                padding: 20,
                margin: 20,
                borderRadius: 10,
            }}
            dismissable={false}
        >
            <Text
                style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 15,
                }}
            >
                서버 연결 오류
            </Text>
            <Text style={{ color: "white", marginBottom: 20 }}>
                서버가 불안정하거나 연결할 수 없습니다. 나중에 다시
                시도해주세요.
            </Text>
            <Button
                mode="contained"
                onPress={handleAppReset}
                style={{ marginTop: 10 }}
            >
                앱 종료
            </Button>
        </Modal>
    );
}
