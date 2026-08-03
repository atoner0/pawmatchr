import { View, Text, StyleSheet } from "react-native";

type Props = {
    value: string | number;
    label: string;
}

export default function StatCard({ value, label }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 8,
    },
    value: {
        fontSize: 28,
        fontWeight: "700",
    },
    label: {
        fontSize: 14,
        color: "#555",
    },
})