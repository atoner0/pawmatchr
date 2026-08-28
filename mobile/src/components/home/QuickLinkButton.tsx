import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, radii } from "@/constants/theme";

type Props = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}

export default function QuickLinkButton({ icon, label, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Ionicons name={icon} size={20} color={colors.navyMid} />
            <Text style={styles.label}>{label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.navyMid} />
        </Pressable>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        backgroundColor: colors.card,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.md,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary
    }
})