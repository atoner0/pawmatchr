import { Text, Pressable, View, StyleSheet } from "react-native"

type Props = {
    label: string;
    value: boolean | undefined;
    onChange: (value: boolean) => void;
}

export function YesNoToggle({ label, value, onChange}: Props) {
    return (
        <View>
            <Text>{label}</Text>
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
    row: {
        flexDirection: "row",
        gap: 12,
        marginTop: 4
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#999",
        alignItems: "center"
    },
    selected: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    },
    unselected: {
        backgroundColor: "#fff"
    },
    selectedText: {
        color: "#fff", fontWeight: "600"
    },
    unselectedText: {
        color: "#333"
    }
});