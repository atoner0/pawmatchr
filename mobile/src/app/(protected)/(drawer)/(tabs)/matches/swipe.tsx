import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { getMatches } from "@/lib/matches";
import { addFavourite } from "@/lib/favourites";
import { markMatchesReviewed } from "@/lib/adopter";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function SwipeScreen() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchWithDog[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const results = await getMatches();
            setMatches(results);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!loading && matches.length > 0 && currentIndex >= matches.length) {
            markMatchesReviewed().then(() => {
                router.replace("/(protected)/(drawer)/(tabs)/matches/ranked")
            });
        }
    }, [currentIndex, loading, matches.length])

    const advance = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const handleReject = () => {
        advance();
    }

    const handleFavourite = async () => {
        const current = matches[currentIndex];
        await addFavourite(current.dog_id);
        advance();
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (matches.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={typography.placeholder}>No matches available right now</Text>
            </View>
        )
    }

    if (currentIndex >= matches.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <DogMatchCard match={matches[currentIndex]}
            footer={
                <View style={styles.actionBar}>
                    <Pressable style={styles.actionButton} onPress={handleReject}>
                        <Ionicons name="close" size={28} color={colors.navyMid} />
                    </Pressable>

                    <Pressable style={styles.actionButton} onPress={handleFavourite}>
                        <Ionicons name="heart-outline" size={26} color={colors.navyMid} />
                    </Pressable>
                </View>
                }
            />

            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    actionBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.xl,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: radii.pill,
        borderWidth: 2,
        borderColor: colors.navyMid,
        justifyContent: "center",
        alignItems: "center",
    },
});
