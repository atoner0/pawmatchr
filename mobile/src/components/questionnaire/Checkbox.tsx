import { colors, spacing, typography } from "@/constants/theme";
import { Text, Pressable, View, StyleSheet } from "react-native"


type Props = {
    label: string;
    isChecked: boolean;
    onPress: () => void;
}

export function CheckBox({ label, isChecked, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.row}>
            <View style={[styles.box, isChecked && styles.checked]}/>
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: spacing.sm + 2, 
        paddingVertical: spacing.xs + 4,
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

