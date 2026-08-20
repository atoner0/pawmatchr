import { colors, radii, spacing, typography } from "@/constants/theme";
import { Text, Pressable, View, StyleSheet } from "react-native"

type Props = {
    title: string;
    label: string;
    value: boolean | undefined;
    onChange: (value: boolean) => void;
}

export function YesNoToggle({ title, label, value, onChange}: Props) {
    return (
        <View style={styles.field}>
            <Text style={typography.label}>{label}</Text>
            <View style={styles.row}>
                <Pressable
                    onPress={() => onChange(true)}
                    style={[styles.button, value === true && styles.selected]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: value === true}}
                    accessibilityLabel={`${title}: Yes`}
                >
                    <Text style={value === true ? styles.selectedText : styles.unselectedText }>Yes</Text>
                </Pressable>
                <Pressable
                    onPress={() => onChange(false)}
                    style={[styles.button, value === false && styles.selected]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: value === false}}
                    accessibilityLabel={`${title}: No`}
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
        paddingVertical: spacing.sm + 6,
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