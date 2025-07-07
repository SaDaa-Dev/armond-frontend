import { getSpacing } from "@/utils/Theme";
import { useNavigation } from "expo-router";
import {
    SafeAreaView,
    StyleSheet,
    View
} from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Settings() {
    const theme = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <View
                style={styles.container}
            >
                <Text>Settings</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: getSpacing("md"),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
    },
});