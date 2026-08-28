import { colors, radii, spacing, typography } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";


type Props = {
    label: string;
    tags: string[];
    notes?: string | null;
};

export default function TagList({ label, tags, notes }: Props) {
    if (tags.length === 0 && !notes) return null

    return (
       <View style={styles.group}>
        <Text style={typography.tagGroupLabel}>{label}</Text>
        {tags.length > 0 && (
            <View style={styles.tagRow}>
                {tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                        <Text style={typography.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>  
        )}
        {notes && <Text style={styles.notesText}>{notes}</Text>}

        
       </View> 
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
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
    notesText: {
        fontSize: 13,
        color: colors.textSecondary,
    }
})