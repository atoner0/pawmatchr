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
import { ApplicationWithDetails } from "@/types/application";
import { getApplications } from "@/lib/applications";
import { getUpcomingBooking } from "@/lib/bookings";
import { BookingWithDetails } from "@/types/booking";
import { colors, spacing, typography } from "@/constants/theme";

export default function HomeScreen() {
    const { adopter, loading: adopterLoading } = useAdopter();
    const [matches, setMatches] = useState<MatchWithDog[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
    const [upcomingBooking, setUpcomingBooking] = useState<BookingWithDetails | null>(null);

    useEffect(() => {
        async function loadHomeData() {
            try {
                const [matchResult, applicationsResult, bookingResult] = await Promise.all([
                    getMatches(),
                    getApplications(),
                    getUpcomingBooking(),
                ]);
                setMatches(matchResult);
                setApplications(applicationsResult)
                setUpcomingBooking(bookingResult)
            } catch (err) {
                console.error("Failed to load home data", err)
                setMatches([]);
            } finally {
                setLoading(false)
            }
        }
        loadHomeData();
    }, []);

    if (adopterLoading || loading || !adopter) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
            </View>
        );
    }

    const topMatch = matches && matches.length > 0 ? matches[0] : null;

    const applicationCount = applications.filter(app =>
        ['submitted', 'under_review', 'approved'].includes(app.status)
    ).length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
                <StatCard value={applicationCount} label="Active applications"/>
            </View>

            <View style={styles.section}>
                <Text style={typography.sectionTitle}>Upcoming Visit</Text>
                <UpcomingVisitCard booking={upcomingBooking} />
            </View>

            <View style={styles.section}>
                <Text style={typography.sectionTitle}>Quick Links</Text>
                <View style={styles.section}>
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
                </View>
            </View>

            

            


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
        gap: spacing.md,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    statsRow: {
        flexDirection: "row",
        gap: spacing.md,
    },
    section: {
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        paddingVertical: spacing.sm,
    },
});