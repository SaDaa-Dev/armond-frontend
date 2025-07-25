import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { WorkoutHeader } from "@/src/components/common/Header";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#1a1a1a',
                },
                headerTintColor: '#FFFFFF',
                tabBarStyle: {
                    backgroundColor: '#1a1a1a',
                    borderTopColor: '#2a2a2a',
                },
                tabBarActiveTintColor: '#8B5CF6',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                tabBarLabelStyle: {
                    color: '#FFFFFF',
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case "workout":
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
            <Tabs.Screen 
                name="workout" 
                options={{ 
                    title: "운동",
                    tabBarLabel: "운동",
                    headerShown: true,
                    header: () => <WorkoutHeader />,
                }} 
            />
            <Tabs.Screen 
                name="settings" 
                options={{ 
                    title: "설정",
                    tabBarLabel: "설정",
                }} 
            />  
        </Tabs>
    );
}
