import CustomButton from "@/src/components/common/Button/CustomButton";
import { useWorkout } from "@/src/hooks/useWorkout";
import { setShowWorkoutSession, setWorkoutMode } from "@/src/store/features/workoutSlice";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { List, Modal, Portal } from "react-native-paper";
import { useDispatch } from "react-redux";
import CreateWorkoutSchedule from "./CreateWorkoutSchedule";
import WorkoutSession from "./workout/workoutComponents/WorkoutSession";
import { WorkoutMod } from "@/src/hooks/useWorkoutQuery";

export default function WorkoutFooter() {
    const [workoutStartModal, setWorkoutStartModal] = useState(false);
    const [showEtcOptionModalVisible, setShowEtcOptionModalVisible] = useState(false);
    const [currentMode, setCurrentMode] = useState(WorkoutMod.QUICK);
    const { activeWorkoutSession } = useWorkout();
    const dispatch = useDispatch();

    // 운동 바로시작 (QUICK 모드)
    const handleQuickStart = () => {
        setCurrentMode(WorkoutMod.QUICK);
        dispatch(setWorkoutMode(WorkoutMod.QUICK));
        setWorkoutStartModal(true);
    };

    // 계획하기 버튼 클릭 시 모달 표시
    const handleEtcOptionPress = () => {
        setShowEtcOptionModalVisible(true);
    };

    // 메인 버튼 클릭 (이어하기 또는 바로시작)
    const handlePress = () => {
        if (activeWorkoutSession) {
            // 진행 중인 운동 이어하기
            dispatch(setShowWorkoutSession(true));
        } else {
            // 운동 바로시작
            handleQuickStart();
        }
    };

    return (
        <>
            <View style={styles.footer}>
                <CustomButton
                    mode="contained"
                    onPress={handlePress}
                    text={activeWorkoutSession ? "이어하기" : "운동 바로시작"}
                />
                <CustomButton
                    text="계획하기"
                    mode="outlined"
                    onPress={handleEtcOptionPress}
                />
            </View>

            {/* 운동 선택 모달 */}
            <CreateWorkoutSchedule   
                visible={workoutStartModal} 
                onDismiss={() => setWorkoutStartModal(false)}
                mode={currentMode}
            />

            {/* 운동 세션 모달 */}
            <WorkoutSession />

            {/* 계획하기 모달 */}
            <Portal>
                <Modal
                    visible={showEtcOptionModalVisible}
                    onDismiss={() => setShowEtcOptionModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <List.Section>
                        <List.Item 
                            title="루틴 만들기" 
                            description="운동 루틴을 만들어서 저장합니다."
                            left={props => <List.Icon {...props} icon="playlist-plus" />}
                            onPress={() => {
                                setShowEtcOptionModalVisible(false);
                                setCurrentMode(WorkoutMod.ROUTINE);
                                dispatch(setWorkoutMode(WorkoutMod.ROUTINE));
                                setWorkoutStartModal(true);
                            }}
                        />
                        <List.Item
                            title="루틴 관리"
                            left={props => <List.Icon {...props} icon="playlist-edit" />}
                            onPress={() => {
                                setShowEtcOptionModalVisible(false);
                            }}
                        />
                        <List.Item
                            title="운동 기록 보기"
                            left={props => <List.Icon {...props} icon="history" />}
                            onPress={() => {
                                setShowEtcOptionModalVisible(false);
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
    }
}); 