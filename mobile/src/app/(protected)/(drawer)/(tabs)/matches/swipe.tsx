import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { getMatches } from "@/lib/matches";
import { addFavourite } from "@/lib/favourites";
import { markMatchesReviewed } from "@/lib/adopter";

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
                <Text>No matches available right now</Text>
            </View>
        )
    }

    if (currentIndex >= matches.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <DogMatchCard match={matches[currentIndex]}/>

            <View style={styles.actionBar}>
                <Pressable style={styles.actionButton} onPress={handleReject}>
                    <Text style={styles.actionIcon}>X</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={handleFavourite}>
                    <Text style={styles.actionIcon}>♥</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    actionBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        paddingVertical: 16,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#0a3b30",
        justifyContent: "center",
        alignItems: "center",
    },
    actionIcon: {
        fontSize: 24,
        color: "#0a3b30"
    },
});
