import { useCallback, useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { getMatches } from "@/lib/matches";
import { addFavourite } from "@/lib/favourites";
import { markMatchesReviewed } from "@/lib/adopter";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ApiError } from "@/lib/api";

export default function SwipeScreen() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchWithDog[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    useFocusEffect(
        useCallback(() => {
            const fetchMatches = async () => {
                setLoading(true);
                setError("");
                try {
                    const data = await getMatches();
                    setMatches(data);
                    setCurrentIndex(0);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load matches."
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchMatches();
        }, [])
    )

    useEffect(() => {
        if (!loading && matches.length > 0 && currentIndex >= matches.length) {
            markMatchesReviewed()
            .catch((err) => console.error("Failed to mark matches reviewed", err))
            .finally(() => {
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
        try {
            await addFavourite(current.dog_id);
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                advance();
                return;
            }
            const errorMessage = err instanceof ApiError ? err.message : "Failed to favourite dog"
            setError(errorMessage)
            return;
        }
        advance();
    }

    if (loading) {
        return (
            <View 
                accessibilityRole="progressbar"
                accessibilityState={{busy : true}}
                accessibilityLabel="Loading matches"
                style={styles.centered}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (matches.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={typography.placeholder}>{error || "No matches available right now"}</Text>
                {error ? (
                    <Pressable onPress={() => router.replace("/(protected)/(drawer)/(tabs)/matches/swipe")}>
                        <Text style={typography.button}>Tap to retry</Text>
                    </Pressable>
                ) : null}
            </View>
        )
    }

    if (currentIndex >= matches.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <DogMatchCard 
                key={matches[currentIndex].dog_id}
                match={matches[currentIndex]}
                footer={
                    <View style={styles.actionBar}>
                        <Pressable 
                            accessibilityLabel={"Reject dog button"}
                            accessibilityRole="button"
                            style={styles.actionButton} 
                            onPress={handleReject}
                        >
                            <Ionicons name="close" size={28} color={colors.navyMid} />
                        </Pressable>

                        <Pressable 
                            accessibilityLabel={"Favourite dog button"}
                            accessibilityRole="button"
                            style={styles.actionButton} 
                            onPress={handleFavourite}
                        >
                            <Ionicons name="heart-outline" size={26} color={colors.navyMid} />
                        </Pressable>
                    </View>

                    
                }
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
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
    errorText: {
        color: colors.danger,
        textAlign: "center",
    },
});
