import { colors, radii, spacing, typography } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";


type Props = {
    label: string;
    tags: string[];
};

export default function TagList({ label, tags }: Props) {
    if (tags.length === 0) return null

    return (
       <View style={styles.group}>
        <Text style={typography.tagGroupLabel}>{label}</Text>
        <View style={styles.tagRow}>
            {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                    <Text style={typography.tagText}>{tag}</Text>
                </View>
            ))}
        </View>
       </View> 
    )
}

const styles = StyleSheet.create({
    group: { 
        gap: spacing.sm,
        marginTop: spacing.sm + 4,
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    tag: {
        backgroundColor: colors.tagAlert,
        borderRadius: radii.pill,
        paddingHorizontal: spacing.sm + 6,
        paddingVertical: spacing.xs + 2,
    },
})