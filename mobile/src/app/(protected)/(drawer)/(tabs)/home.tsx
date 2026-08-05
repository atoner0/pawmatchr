import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { getMatches } from "@/lib/matches";
import { MatchWithDog } from "@/types/match";
import HomeGreeting from "@/components/home/HomeGreeting";
import QuickLinkButton from "@/components/home/QuickLinkButton";
import StatCard from "@/components/home/StatCard";
import TopMatchCard from "@/components/home/TopMatchCard";
import UpcomingVisitCard from "@/components/home/UpcomingVisit";
import { useAdopter } from "@/context/AdopterContext";

export default function HomeScreen() {
    const { adopter, loading: adopterLoading } = useAdopter();
    const [matches, setMatches] = useState<MatchWithDog[] | null>(null);
    const [matchesLoading, setMatchesLoading] = useState(true);

        useEffect(() => {
        async function loadMatches() {
            try {
                const result = await getMatches();
                setMatches(result);
            } catch (err) {
                console.error("Failed to load matches", err);
                setMatches([]);
            } finally {
                setMatchesLoading(false);
            }
        }
        loadMatches();
    }, []);

    if (adopterLoading || matchesLoading || !adopter) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        );
    }

    const topMatch = matches && matches.length > 0 ? matches[0] : null;

    return (
        <ScrollView style={styles.container}>
            <HomeGreeting adopter={adopter}/>

            {topMatch ? (
                <TopMatchCard
                    match={topMatch}
                    onPress={() => 
                        router.push({
                            pathname: "/matches/[dogId]",
                            params: { dogId: String(topMatch.dog.dog_id), match: JSON.stringify(topMatch) },
                        })
                    }
                />
            ) : (
                <Text style={styles.emptyText}>Complete questionnaire to see matches</Text>
            )}

            <View style={styles.statsRow}>
                <StatCard value={matches?.length ?? 0} label="Total matches"/>
                <StatCard value="-" label="Active applications"/>
            </View>

            <UpcomingVisitCard />

            <QuickLinkButton
                icon="heart-outline"
                label="My Favourites"
                onPress={() => router.push("/(protected)/(drawer)/(tabs)/matches/ranked")}
            />
            <QuickLinkButton
                icon="document-text-outline"
                label="My Applications"
                onPress={() => router.push("/(protected)/(drawer)/(tabs)/applications")}
            />
            <QuickLinkButton
                icon="book-outline"
                label="Support Materials"
                onPress={() => router.push("/(protected)/(drawer)/(tabs)/support")}
            />


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: "#555",
        paddingVertical: 12,
    },
});