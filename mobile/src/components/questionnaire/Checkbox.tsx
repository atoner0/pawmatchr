import { colors, spacing, typography } from "@/constants/theme";
import { Text, Pressable, View, StyleSheet } from "react-native"


type Props = {
    label: string;
    isChecked: boolean;
    onPress: () => void;
    accessibilityLabel?: string;
}

export function CheckBox({ label, isChecked, accessibilityLabel, onPress }: Props) {
    return (
        <Pressable 
            onPress={onPress} 
            style={styles.row}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            accessibilityLabel={accessibilityLabel ?? label}
        >
            <View style={[styles.box, isChecked && styles.checked]}/>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    row: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: spacing.sm + 2, 
        paddingVertical: spacing.sm + 4,
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: colors.navyMid,
        justifyContent: "center",
        alignItems: "center",
    },
    checked: {
        backgroundColor: colors.navyMid,
    },
    label: {
        color: colors.textPrimary,
        fontSize: 15,
        flex: 1,
    }
});

