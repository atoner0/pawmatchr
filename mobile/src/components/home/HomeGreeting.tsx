import { View, Text, StyleSheet } from "react-native";
import { AccountFields } from "@/types/adopter";
import { colors, spacing } from "@/constants/theme";

type Props = {
    adopter: AccountFields;
}

export default function HomeGreeting({ adopter }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.name}>Hey, {adopter.first_name}</Text>
        </View>     
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center", 
        paddingVertical: spacing.sm,
    },
    name: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.textPrimary,
    },
})

