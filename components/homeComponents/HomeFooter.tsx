import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import HomeFooterBtn from "./HomeFooterBtn";

export default function HomeFooter() {
    return (
        <View style={styles.footer}>
            <HomeFooterBtn text="운동 시작" onPress={() => console.log('운동 시작')} />
            <HomeFooterBtn 
                text="계획하기" 
                mode="outlined"
                onPress={() => console.log('계획하기')} 
            />
        </View>
    );
}   
const styles = StyleSheet.create({
    footer: {
        padding: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
});   