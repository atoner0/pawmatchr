import { useLocalSearchParams } from "expo-router";
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react";
import { ApplicationWithDetails } from "@/types/application";
import { getApplications } from "@/lib/applications";
import { colors, radii, spacing, typography } from "@/constants/theme";

export default function DogDetailScreen() {
    const params = useLocalSearchParams<{ dogId: string; match: string }>();
    const match: MatchWithDog = JSON.parse(params.match);

    const [existingApplication, setExistingApplication] = useState<ApplicationWithDetails | null>(null);
    const [loadingApplication, setLoadingApplication] = useState(true);

    useEffect(() => {
        const checkApplication = async () => {
            try {
                const applications = await getApplications();
                const found = applications.find(app => app.dog_id === match.dog_id);
                setExistingApplication(found ?? null);
            } catch (err) {
                console.log("Error checking applications:", err)
            } finally {
                setLoadingApplication(false);
            }
        };

        checkApplication();
    }, []);

    const handleApplyPress = () => {
        if (existingApplication) {
            router.push({
                pathname: "/(protected)/application/[id]",
                params: { id: String(existingApplication.application_id)}
            });
        } else {
            router.push({
                pathname: "/(protected)/application/new",
                params: { match: JSON.stringify(match) }
            });
        }
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={20}/>
            </Pressable>
            <DogMatchCard match={match}
            />

            {loadingApplication ? (
                <ActivityIndicator style={styles.loadingIndicator} />
            ) : (
                <Pressable onPress={handleApplyPress} style={styles.applyButton}>
                    <Text style={typography.button}>{existingApplication ? "View Application" : "Apply to Adopt"}</Text>
                </Pressable>
            )}
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.md,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: spacing.md,
        marginTop: spacing.sm
    },
    loadingIndicator: {
        marginTop: spacing.md,
    },
    buttonWrapper: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    applyButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 4,
        alignItems: "center",
    },
})