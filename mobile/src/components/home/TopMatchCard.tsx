import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, radii } from "@/constants/theme";

type Props = {
    match: MatchWithDog;
    onPress: () => void;
}

export default function TopMatchCard({ match, onPress }: Props) {
    const { dog, overall_score } = match;
    const scorePercent = Math.round(overall_score * 100);
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={styles.title}>Your top match</Text>
                    <Text style={styles.name}>{dog.name} - {scorePercent}%</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textOnDark}/>
            </View>
        </Pressable>
            
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: { 
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        backgroundColor: colors.navyMid,
        borderRadius: radii.lg,
        padding: spacing.md,
        marginTop: spacing.md,
    },
    photo: { 
        width: 96, 
        height: 96, 
        borderRadius: radii.md,
    },
    textBlock: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.textOnDark,
        marginTop: spacing.xs,
    },
    title: {
        fontSize: 15, 
        color: colors.textOnDark,
        opacity: 0.8,
    },
})

