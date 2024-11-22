import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const CalorieDonutChart = () => {
  const goal = 1000; // 목표 칼로리
  const consumed = 350; // 현재 섭취한 칼로리
  const remaining = goal - consumed; // 남은 칼로리

  // 도넛 차트에 표시할 데이터
  const data = [
    { value: consumed, color: '#4CAF50' }, // 섭취한 칼로리 부분 (녹색)
    { value: remaining, color: '#E0E0E0' }, // 남은 칼로리 부분 (회색)
  ];

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        donut
        showText
        textColor="black"
        textSize={20}
        innerCircleColor="white"
        radius={100}
        innerRadius={70}
        centerLabelComponent={() => (
          <Text style={styles.centerLabel}>
            {`${((consumed / goal) * 100).toFixed(1)}%`}
          </Text>
        )}
      />
      <Text style={styles.label}>
        {`목표: ${goal} kcal\n현재: ${consumed} kcal\n남은: ${remaining} kcal`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  centerLabel: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CalorieDonutChart;