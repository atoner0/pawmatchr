import { useCallback, useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator, Text, FlatList } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { MatchWithDog } from "@/types/match";
import { getFavourites } from "@/lib/favourites"; 
import FavouriteRow from "@/components/matches/FavouriteRow";
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, typography } from "@/constants/theme";

export default function RankedScreen() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchWithDog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    useFocusEffect(
        useCallback(() => {
            const fetchFavourites = async () => {
                setLoading(true);
                setError("");
                try {
                    const data = await getFavourites();
                    setMatches(data);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load favourites."
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavourites();
        }, [])
    )

    if (loading) {
            return (
                <View 
                    accessibilityRole="progressbar"
                    accessibilityState={{busy : true}}
                    accessibilityLabel="Loading application"
                    style={styles.centered}
                >
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    
    if (matches.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={typography.placeholder}>You haven't favourited any dogs yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={matches}
                keyExtractor={(item) => item.match_id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <FavouriteRow
                        match={item}
                        onPress={() => {
                            router.push({
                                pathname: "/matches/[dogId]",
                                params: {
                                    dogId: item.dog_id.toString(),
                                    match: JSON.stringify(item)
                                }
                            })
                        }}
                    />
                )}
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
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    }
});
