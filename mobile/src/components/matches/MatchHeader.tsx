import { View, Text, Image, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { capitaliseFirst } from "@/lib/formatText";

type Props = {
    match: MatchWithDog;
};

export default function MatchHeader({ match }: Props) {
    const { dog, shelter, overall_score, explanation } = match;
    const scorePercent = Math.round(overall_score * 100);

    return (
        <View style={styles.container}>
            <View style={styles.photoContainer}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{scorePercent}%</Text>
                </View>
            </View>

            <View style={styles.nameRow}>
                <Text style={typography.cardTitle}>{dog.name}</Text>
                <Text style={typography.cardSubtitle}>
                    {dog.breed} | {capitaliseFirst(dog.gender)}
                </Text>
            </View>

            <View style={styles.explanationBox}>
                <Text style={typography.body}>{explanation}</Text>
            </View>

            <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary}/>
                <Text style={typography.cardSubtitle}>
                    {shelter.name}, {shelter.city}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm + 2,
    },
    photoContainer: { 
        position: 'relative' 
    },
    photo: { 
        width: '100%', 
        height: 240, 
        borderRadius: radii.lg,
    },
    badge: {
        position: 'absolute',
        top: spacing.sm + 4,
        right: spacing.sm + 4,
        backgroundColor: colors.navyDark,
        paddingHorizontal: spacing.sm + 4,
        paddingVertical: spacing.xs + 2,
        borderRadius: radii.pill,
    },
    badgeText: {
        color: colors.textOnDark,
        fontWeight: "600",
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
    },
    explanationBox: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
})