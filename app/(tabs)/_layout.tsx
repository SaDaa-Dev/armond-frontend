import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <PaperProvider>
            <Tabs
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: "#6200ee",
                    tabBarInactiveTintColor: "gray",
                    tabBarIcon: ({ color, size }) => {
                        let iconName: string;

                        switch (route.name) {
                            case "index":
                                iconName = "home";
                                break;
                            case "settings":
                                iconName = "settings";
                                break;
                            default:
                                iconName = "alert-circle";
                                break;
                        }

                        return (
                            <Ionicons
                                name={iconName as any}
                                size={size}
                                color={color}
                            />
                        );
                    },
                })}
            >
                <Tabs.Screen name="index" options={{ title: "홈" }} />
                <Tabs.Screen name="settings" options={{ title: "설정" }} />
            </Tabs>
        </PaperProvider>
    );
}
