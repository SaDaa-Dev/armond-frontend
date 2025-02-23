import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

interface WorkoutCategory {
    id: string;
    label: string;
}

const WORKOUT_CATEGORIES: WorkoutCategory[] = [
    { id: "chest", label: "가슴" },
    { id: "back", label: "등" },
    { id: "arms", label: "팔" },
    { id: "shoulders", label: "어깨" },
    { id: "legs", label: "하체" },
];

interface WorkoutCategoriesProps {
    selectedCategories: string[];
    onCategoryPress: (categoryId: string) => void;
}

export default function WorkoutCategories({ selectedCategories, onCategoryPress }: WorkoutCategoriesProps) {
    return (
        <View style={styles.chipContainer}>
            {WORKOUT_CATEGORIES.map((category) => (
                <Chip
                    key={category.id}
                    selected={selectedCategories.includes(category.id)}
                    onPress={() => onCategoryPress(category.id)}
                    style={[
                        styles.chip,
                        selectedCategories.includes(category.id) && styles.selectedChip,
                    ]}
                    textStyle={[
                        styles.chipText,
                        selectedCategories.includes(category.id) && styles.selectedChipText,
                    ]}
                    showSelectedCheck={false}
                >   
                    {category.label}
                </Chip>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    chipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 30,
    },
    chip: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#8A2BE2",
        height: 32,
    },
    selectedChip: {
        backgroundColor: "#8A2BE2",
        borderColor: "#8A2BE2",
    },
    chipText: {
        fontSize: 14,
        color: "#8A2BE2",
    },
    selectedChipText: {
        color: "#FFFFFF",
    },
}); 