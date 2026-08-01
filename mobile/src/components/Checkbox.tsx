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
            <Text>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10, 
        paddingVertical: 6
    },
    box: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#999"
    },
    checked: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    }
});

