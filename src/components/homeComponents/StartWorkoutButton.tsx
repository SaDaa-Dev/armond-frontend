import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useWorkout } from '@/src/hooks/useWorkout';

interface StartWorkoutButtonProps {
    onPress: () => void;
}

export default function StartWorkoutButton({ onPress }: StartWorkoutButtonProps) {
    return (
        <Button
            mode="contained"
            style={styles.startWorkoutButton}
            labelStyle={{
                fontSize: 16,
                fontWeight: "bold",
            }}
            onPress={onPress}
        >
            <Text style={{ color: "#FFFFFF" }}>운동 시작</Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    startWorkoutButton: {
        backgroundColor: "#8A2BE2",
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 12,
        paddingVertical: 6,
    },
}); 