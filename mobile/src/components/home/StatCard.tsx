import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radii } from "@/constants/theme";

type Props = {
    value: string | number;
    label: string;
}

export default function StatCard({ value, label }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: radii.md,
        paddingVertical: spacing.sm + 2,
    },
    value: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textPrimary
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: "center",
    },
})