import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { childrenAgeLabel, getDogLabel, goodWithLabel } from "@/constants/dogLabels";
import { colors, radii, spacing, typography } from "@/constants/theme";

type Props = {
    match: MatchWithDog;
};

export default function CompatibilitySection({ match }: Props) {
    const { dog } = match;

    return (
        <View style={styles.section}>
            <Text style={typography.sectionTitle}>Compatibility</Text>
            <View style={styles.box}>
                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Good with dogs: ${getDogLabel(goodWithLabel, dog.good_with_dogs)}`}
                >
                    <Text style={typography.label}>Dogs</Text>
                    <Text style={dog.good_with_dogs === "unknown" ? styles.valueWarning : typography.value}>
                        {getDogLabel(goodWithLabel, dog.good_with_dogs)}
                    </Text>
                </View>

                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Good with cats: ${getDogLabel(goodWithLabel, dog.good_with_cats)}`}
                >
                    <Text style={typography.label}>Cats</Text>
                    <Text style={dog.good_with_cats === "unknown" ? styles.valueWarning : typography.value}>
                        {getDogLabel(goodWithLabel, dog.good_with_cats)}
                    </Text>
                </View>

                <View 
                    style={styles.row}
                    accessible={true}
                    accessibilityLabel={`Good with children: ${getDogLabel(goodWithLabel, dog.good_with_children)}`}
                >
                    <Text style={typography.label}>Children</Text>
                    <Text style={dog.good_with_children === "unknown" ? styles.valueWarning : typography.value}>
                        {getDogLabel(goodWithLabel, dog.good_with_children)}
                    </Text>
                </View>

                {dog.good_with_children === "yes" && (
                    <View 
                        style={styles.row}
                        accessible={true}
                        accessibilityLabel={`Minimum children age: ${getDogLabel(childrenAgeLabel, dog.children_age)}`}
                    >
                        <Text style={typography.label}>Children Ages</Text>
                        <Text style={dog.children_age === "unknown" ? styles.valueWarning : typography.value}>
                            {getDogLabel(childrenAgeLabel, dog.children_age)}
                        </Text>
                    </View>
                 )}
            </View>
        </View>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
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
    valueWarning: {
        ...typography.value,
        color: colors.danger,
    },
})