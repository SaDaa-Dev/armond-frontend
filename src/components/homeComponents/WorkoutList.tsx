import { increment } from "@/src/store/features/workoutSlice";
import { RootState, AppDispatch } from "@/src/store/configureStore";
import { Button, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { useMemo, useCallback } from "react";
import { createSelector } from "@reduxjs/toolkit";

// 타입이 지정된 커스텀 훅
export const useWorkoutDispatch: () => AppDispatch = useDispatch;
export const useWorkoutSelector: TypedUseSelectorHook<RootState> = useSelector;

// 기본 셀렉터
const selectWorkoutState = (state: RootState) => state.workout;

// 메모이제이션된 셀렉터 - 실제 변환 로직 포함
const selectWorkoutStats = createSelector(
    [selectWorkoutState],
    (workout) => ({
        count: workout.count,
        isEven: workout.count % 2 === 0,
        doubleCount: workout.count * 2
    })
);

export default function WorkoutList() {
    const dispatch = useWorkoutDispatch();
    
    // 메모이제이션된 셀렉터 사용
    const { count, isEven, doubleCount } = useWorkoutSelector(selectWorkoutStats);
    
    // 메모이제이션된 이벤트 핸들러
    const handleIncrement = useCallback(() => {
        console.log("increment");
        debugger;
        dispatch(increment());
    }, [dispatch]);
    
    return (
        <View>
            <Text>Count: {count}</Text>
            <Text>Double Count: {doubleCount}</Text>
            <Text>{isEven ? "짝수" : "홀수"}</Text>
            

            <View>
                <Button 
                    title="Increment" 
                    onPress={handleIncrement}
                />
            </View>
        </View>
    );
}   