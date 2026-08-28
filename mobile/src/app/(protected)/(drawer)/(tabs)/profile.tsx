import { View, Text, StyleSheet } from "react-native";

export default function ProfilePlaceholder() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.placeholder}>placeholder</Text>
        </View>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    placeholder: {
        fontSize: 16,
        color: "#555",
    },
})