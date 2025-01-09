import { useWorkoutStore } from '@/src/store/workoutStore';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, IconButton, Portal, Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CreateWorkoutScheduleProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function CreateWorkoutSchedule({ visible, onDismiss }: CreateWorkoutScheduleProps) {
    const theme = useTheme();
    const translateY = useSharedValue(0);
    const { count, actions } = useWorkoutStore();

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(-SCREEN_HEIGHT * 0.9, {
                damping: 50,
            });
        } else {
            translateY.value = withSpring(0, {
                damping: 50,
            });
        }
    }, [visible]);

    return (
        <Portal>
            <Animated.View 
                style={[
                    styles.container, 
                    rBottomSheetStyle,
                    { backgroundColor: theme.colors.elevation.level2 }
                ]}
            >
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                        새로운 운동
                    </Text>
                    <IconButton
                        icon="close"
                        size={24}
                        onPress={onDismiss}
                        iconColor={theme.colors.onSurface}
                    />
                </View>
                <View style={styles.content}>
                    {/* 여기에 운동 선택 폼 등 추가 */}
                    <Text>{count}</Text>
                    <Button onPress={actions.increment}>Increment</Button>
                    
                </View>
            </Animated.View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: 25,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    content: {
        flex: 1,
    },
}); 