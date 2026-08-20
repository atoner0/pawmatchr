import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { activityLevelLabel, aloneToleranceLabel, getDogLabel, trainingLevelLabel } from "@/constants/dogLabels";
import { colors, radii, spacing, typography } from "@/constants/theme";

type Props = {
    match: MatchWithDog;
};

export default function RoutineSection({ match }: Props) {
    const { dog } = match;

    return (
        <View style={styles.section}>
            <Text style={typography.sectionTitle}>Routine</Text>
            <View style={styles.box}>
                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Alone Tolerance: ${getDogLabel(aloneToleranceLabel, dog.alone_tolerance)}`}
                >
                    <Text style={typography.label}>Hours Alone</Text>
                    <Text style={typography.value}>{getDogLabel(aloneToleranceLabel, dog.alone_tolerance)}</Text>
                </View>

                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Activity Level: ${getDogLabel(activityLevelLabel, dog.activity_level)}`}
                >
                    <Text style={typography.label}>Activity Level</Text>
                    <Text style={typography.value}>{getDogLabel(activityLevelLabel, dog.activity_level)}</Text>
                </View>

                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Training Needed: ${getDogLabel(trainingLevelLabel, dog.training_level)}`}
                >
                    <Text style={typography.label}>Training Needed</Text>
                    <Text style={typography.value}>{getDogLabel(trainingLevelLabel, dog.training_level)}</Text>
                </View>
            </View>

            

        </View>
    )
}

const styles = StyleSheet.create({
    section: { 
        gap: spacing.sm,
    },
    box: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.xs + 2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.cardBorder,
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    
})