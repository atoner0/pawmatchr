import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/constants/theme";

type Props = {
    title: string
}

export default function HeaderTitle({ title }: Props) {
     return (
        <View style={styles.container}>
            <Ionicons name="paw" size={22} color={colors.navyDark}/>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: colors.navyDark,
    },
})