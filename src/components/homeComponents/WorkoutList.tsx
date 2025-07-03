import { useWorkout } from "@/src/hooks/useWorkout";
import {
    addCheckedWorkout,
    clearCheckedWorkouts,
    deleteWorkoutRoutine,
    setShowWorkoutSession
} from "@/src/store/features/workoutSlice";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { getSpacing, getRadius, getShadow } from "@/utils/Theme";

const WORKOUT_PRESETS = {   
    chest: [
        { id: 1, title: "벤치프레스", subtitle: "가슴 운동의 기본" },
        { id: 2, title: "인클라인 덤벨 프레스", subtitle: "상부 가슴 강화" },
        { id: 3, title: "딥스", subtitle: "하부 가슴과 삼두" },
    ],
    back: [
        { id: 4, title: "데드리프트", subtitle: "전신 운동" },
        { id: 5, title: "풀업", subtitle: "등근육 발달" },
    ],
};

export default function RoutineList() {
    const dispatch = useDispatch();
    const { routines, showWorkoutSession, activeWorkoutSession } = useWorkout();
    const theme = useTheme();

    const getWorkoutTitle = (workoutId: number) => {
        for (const category of Object.values(WORKOUT_PRESETS)) {
            const workout = category.find(w => w.id === workoutId);
            if (workout) return workout.title;
        }
        return '';
    };
    
    const handleStartRoutine = (routine: any) => {
        // 이미 진행 중인 운동이 있거나 운동 세션이 표시된 경우
        if ((activeWorkoutSession && activeWorkoutSession.isActive) || showWorkoutSession) {
            Toast.show({
                type: "error",
                text1: "진행 중인 운동이 있습니다",
                text2: "기존 운동을 계속하거나 종료 후 새 루틴을 시작하세요"
            });
            return;
        }
        
        // 기존 체크된 운동 초기화
        dispatch(clearCheckedWorkouts());
        
        // 루틴의 운동들을 체크된 운동으로 설정
        routine.workouts.forEach((workoutId: number) => {
            dispatch(addCheckedWorkout(workoutId));
        });
        
        // 운동 세션 시작
        dispatch(setShowWorkoutSession(true));
    };
    
    return (
        <View style={styles.container}>
            <Text 
                variant="titleLarge" 
                style={[
                    styles.sectionTitle,
                    { color: theme.colors.onBackground }
                ]}
            >
                내 운동 루틴
            </Text>
            {routines.map((routine) => {
                const isWorkoutActive = (activeWorkoutSession && activeWorkoutSession.isActive) || showWorkoutSession;
                
                return (
                    <Card 
                        key={routine.id} 
                        style={[
                            styles.card,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.outline,
                            },
                            isWorkoutActive && {
                                ...styles.disabledCard,
                                backgroundColor: theme.colors.surface + '80',
                            }
                        ]}
                        onPress={isWorkoutActive ? undefined : () => handleStartRoutine(routine)}
                    >
                        <Card.Title
                            title={routine.name}
                            subtitle={`${routine.workouts.length}개의 운동`}
                            titleStyle={{ color: theme.colors.onSurface }}
                            subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                            right={(props) => (
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    iconColor={theme.colors.onSurface}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        dispatch(deleteWorkoutRoutine(routine.id));
                                    }}
                                />
                            )}
                        />
                        <Card.Content>
                            {routine.workouts.map((workoutId, index) => (
                                <Text 
                                    key={workoutId} 
                                    style={[
                                        styles.workoutItem,
                                        { color: theme.colors.onSurfaceVariant }
                                    ]}
                                >
                                    {index + 1}. {getWorkoutTitle(workoutId)}
                                </Text>
                            ))}
                        </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                            <Text 
                                style={[
                                    styles.startText,
                                    { color: theme.colors.onSurfaceVariant }
                                ]}
                            >
                                {isWorkoutActive 
                                    ? "진행 중인 운동이 있어 시작할 수 없습니다" 
                                    : "탭하여 이 루틴으로 운동 시작"}
                            </Text>
                        </Card.Actions>
                    </Card>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: getSpacing('md'),
    },
    sectionTitle: {
        marginBottom: getSpacing('md'),
        fontWeight: '600',
    },
    card: {
        marginBottom: getSpacing('md'),
        borderRadius: getRadius('lg'),
        borderWidth: 1,
        ...getShadow('sm'),
    },
    disabledCard: {
        opacity: 0.6,
    },
    workoutItem: {
        marginVertical: getSpacing('xs'),
        lineHeight: 20,
    },
    cardActions: {
        justifyContent: 'center',
        paddingTop: 0,
    },
    startText: {
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    }
});   