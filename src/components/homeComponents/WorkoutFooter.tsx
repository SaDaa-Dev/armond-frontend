import CustomButton from "@/src/components/common/Button/CustomButton";
import { useWorkout } from "@/src/hooks/useWorkout";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { List, Modal, Portal } from "react-native-paper";
import { useDispatch } from "react-redux";
import CreateWorkoutSchedule from "./CreateWorkoutSchedule";
import { setShowWorkoutSession } from "@/src/store/features/workoutSlice";
import WorkoutSession from "./workout/workoutComponents/WorkoutSession";

export default function WorkoutFooter() {
    const [quickStartVisible, setQuickStartVisible] = useState(false);
    const [planningModalVisible, setPlanningModalVisible] = useState(false);
    const { showWorkoutSession, checkedWorkouts } = useWorkout();
    const dispatch = useDispatch();

    const handleQuickStart = () => {
        setQuickStartVisible(true);
    };

    const handlePlanningPress = () => {
        setPlanningModalVisible(true);
    };

    return (
        <>
            <View style={styles.footer}>
                <CustomButton
                    text="운동 바로시작"
                    onPress={handleQuickStart}
                />
                <CustomButton
                    text="계획하기"
                    mode="outlined"
                    onPress={handlePlanningPress}
                />
            </View>

            {/* 빠른 시작 모드 */}
            <CreateWorkoutSchedule   
                visible={quickStartVisible} 
                onDismiss={() => setQuickStartVisible(false)}
                mode="quick"
            />

            <WorkoutSession />

            {/* 계획하기 모달 */}
            <Portal>
                <Modal
                    visible={planningModalVisible}
                    onDismiss={() => setPlanningModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <List.Section>
                        <List.Item
                            title="새 루틴 만들기"
                            left={props => <List.Icon {...props} icon="playlist-plus" />}
                            onPress={() => {
                                setPlanningModalVisible(false);
                                setQuickStartVisible(true);
                            }}
                        />
                        <List.Item
                            title="루틴 관리"
                            left={props => <List.Icon {...props} icon="playlist-edit" />}
                            onPress={() => {
                                // TODO: 루틴 관리 화면으로 이동
                                setPlanningModalVisible(false);
                            }}
                        />
                        <List.Item
                            title="운동 기록 보기"
                            left={props => <List.Icon {...props} icon="history" />}
                            onPress={() => {
                                // TODO: 운동 기록 화면으로 이동
                                setPlanningModalVisible(false);
                            }}
                        />
                    </List.Section>
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 16,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
    modalContainer: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        margin: 20,
        padding: 20,
        borderRadius: 12,
    },
}); 