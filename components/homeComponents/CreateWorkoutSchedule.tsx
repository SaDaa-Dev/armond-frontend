import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, Portal, Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface CreateWorkoutSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function CreateWorkoutSheet({ visible, onDismiss }: CreateWorkoutSheetProps) {
  const theme = useTheme();
  const translateY = useSharedValue(0);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  React.useEffect(() => {
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