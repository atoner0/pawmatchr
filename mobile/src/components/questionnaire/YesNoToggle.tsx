import { colors, radii, spacing, typography } from "@/constants/theme";
import { Text, Pressable, View, StyleSheet } from "react-native"

type Props = {
    label: string;
    value: boolean | undefined;
    onChange: (value: boolean) => void;
}

export function YesNoToggle({ label, value, onChange}: Props) {
    return (
        <View style={styles.field}>
            <Text style={typography.label}>{label}</Text>
            <View style={styles.row}>
                <Pressable
                    onPress={() => onChange(true)}
                    style={[styles.button, value === true && styles.selected]}
                >
                    <Text style={value === true ? styles.selectedText : styles.unselectedText }>Yes</Text>
                </Pressable>
                <Pressable
                    onPress={() => onChange(false)}
                    style={[styles.button, value === false && styles.selected]}
                >
                    <Text style={value === false ? styles.selectedText : styles.unselectedText}>No</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    field: {
        gap: spacing.sm,
    },
    row: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.sm + 4,
        borderRadius: radii.pill,
        backgroundColor: colors.card,
        alignItems: "center"
    },
    selected: {
        backgroundColor: colors.navyMid,
    },
    selectedText: {
        color: colors.textOnDark, 
        fontWeight: "600"
    },
    unselectedText: {
        color: colors.textPrimary
    }
});