import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { childrenAgeLabel, getDogLabel, goodWithLabel } from "@/constants/dogLabels";

type Props = {
    match: MatchWithDog;
};

export default function CompatibilitySection({ match }: Props) {
    const { dog } = match;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Compatibility</Text>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Dogs</Text>
                <Text style={dog.good_with_dogs === "unknown" ? styles.rowValueWarning : styles.rowValue}>
                    {getDogLabel(goodWithLabel, dog.good_with_dogs)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Cats</Text>
                <Text style={dog.good_with_cats === "unknown" ? styles.rowValueWarning : styles.rowValue}>
                    {getDogLabel(goodWithLabel, dog.good_with_cats)}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.rowLabel}>Children</Text>
                <Text style={dog.good_with_children === "unknown" ? styles.rowValueWarning : styles.rowValue}>
                    {getDogLabel(goodWithLabel, dog.good_with_children)}
                </Text>
            </View>

            {dog.good_with_children === "yes" && (
                <View style={styles.row}>
                <Text style={styles.rowLabel}>Children Ages</Text>
                <Text style={dog.children_age === "unknown" ? styles.rowValueWarning : styles.rowValue}>
                    {getDogLabel(childrenAgeLabel, dog.children_age)}
                </Text>
            </View>
        )}
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
    rowValueWarning: {
        fontSize: 14,
        fontWeight: "600",
        color: "#c1502e"
    }
})