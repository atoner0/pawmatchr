import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"

type Props = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}

export default function QuickLinkButton({ icon, label, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Ionicons name={icon} size={20}/>
            <Text style={styles.label}>{label}</Text>
            <Ionicons name="chevron-forward" size={20}/>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
    }
})