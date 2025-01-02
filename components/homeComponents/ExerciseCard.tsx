import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function ExerciseCard() {
    const theme = useTheme();

    return (
        <Card 
            style={[
                styles.card,
                { backgroundColor: theme.colors.elevation.level2 }
            ]}
        >
            <Card.Title 
                title="운동명"
                titleStyle={{ color: theme.colors.onSurface }}
            />
            <Card.Content>
                <Text 
                    variant="bodyMedium" 
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    벤치프레스
                </Text>
                <Text 
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    인클라인 덤벨 프레스
                </Text>
                <Text 
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    플라이 머신
                </Text>
            </Card.Content>        
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 5,
        elevation: 2,  // Android 그림자
        shadowColor: '#000',  // iOS 그림자
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    }
});
