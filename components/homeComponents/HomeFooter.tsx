import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function HomeFooter() {
    return (
        <View style={styles.footer}>
            <Button 
                mode="contained" 
                style={styles.button}
                onPress={() => console.log('운동 시작')}
            >
                운동 시작
            </Button>
            <Button 
                mode="outlined"
                style={styles.button}
                onPress={() => console.log('계획하기')}
            >
                계획하기
            </Button>
        </View>
    );
}   

const styles = StyleSheet.create({
    footer: {
        padding: 24,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    button: {
        flex: 1, // 버튼이 동일한 너비를 가지도록
    },
});   