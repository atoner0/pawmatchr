import { View, Text, StyleSheet } from "react-native";
import { AccountFields } from "@/types/adopter";

type Props = {
    adopter: AccountFields;
}

export default function HomeGreeting({ adopter }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.textBlock}>
                <Text style={styles.name}>Hey, {adopter.first_name}</Text>
            </View>
        </View>     
    )
}

const styles = StyleSheet.create({
    container: { 
        alignItems: "center",
        paddingVertical: 8,
    },
    textBlock: {
        flex: 1,
    },
    name: {
        fontSize: 32,
        fontWeight: "700",
    },
})

