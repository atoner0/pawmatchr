import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"
import { colors, radii, spacing, typography } from "@/constants/theme";
import { capitaliseFirst } from "@/lib/formatText";

type Props = {
    match: MatchWithDog;
    onPress: () => void;
}

export default function FavouriteRow({ match, onPress }: Props) {
    const { dog, overall_score } = match;
    const scorePercent = Math.round(overall_score * 100);
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={typography.cardTitle}>{dog.name} - {scorePercent}%</Text>
                    <Text style={typography.cardSubtitle}>
                        {dog.breed} | {capitaliseFirst(dog.gender)}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20}/>
            </View>
        </Pressable>
            
    )
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm + 4,
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: spacing.sm + 4,
    },
    photo: { 
        width: 64, 
        height: 64, 
        borderRadius: radii.md
    },
    textBlock: {
        flex: 1,
    },
})

