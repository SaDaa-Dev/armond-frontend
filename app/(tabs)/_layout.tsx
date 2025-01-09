import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import "react-native-reanimated";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: theme.colors.elevation.level1,
                },
                headerTintColor: '#FFFFFF',
                tabBarStyle: {
                    backgroundColor: theme.colors.elevation.level1,
                    borderTopColor: theme.colors.elevation.level2,
                },
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                tabBarLabelStyle: {
                    color: '#FFFFFF',
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case "index":
                            iconName = "home";
                            break;
                        case "calendar":
                            iconName = "calendar";
                            break;
                        case "statistics":
                            iconName = "stats-chart";
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
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: "운동",
                    tabBarLabel: "운동",
                }} 
            />
            <Tabs.Screen name="calendar" options={{ title: "캘린더" }} />
            <Tabs.Screen name="statistics" options={{ title: "통계" }} />
            <Tabs.Screen name="settings" options={{ title: "설정" }} />
        </Tabs>
    );
}
