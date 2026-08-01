import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { activityLevelLabel, aloneToleranceLabel, getDogLabel, trainingLevelLabel } from "@/constants/dogLabels";

type Props = {
    match: MatchWithDog;
};

export default function RoutineSection({ match }: Props) {
    const { dog } = match;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Routine</Text>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Hours Alone</Text>
                <Text style={styles.rowValue}>{getDogLabel(aloneToleranceLabel, dog.alone_tolerance)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Activity Level</Text>
                <Text style={styles.rowValue}>{getDogLabel(activityLevelLabel, dog.activity_level)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Training Needed</Text>
                <Text style={styles.rowValue}>{getDogLabel(trainingLevelLabel, dog.training_level)}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    heading: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e0d5c5",
    },
    rowLabel: {
        fontSize: 14,
    },
    rowValue: {
        fontSize: 14,
        fontWeight: "600",
    },
})