import { useLocalSearchParams } from "expo-router";
import { Pressable, View, Text, ActivityIndicator, StyleSheet, AccessibilityInfo } from "react-native";
import { router } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react";
import { ApplicationWithDetails } from "@/types/application";
import { getApplications } from "@/lib/applications";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

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
                AccessibilityInfo.announceForAccessibility(
                    found ? "Application loaded" : "Ready to apply to adopt"
                )
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
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
           <View style={styles.content}>
                <View style={styles.header}>
                    <Pressable
                        accessibilityLabel={"Back button"}
                        accessibilityRole="button" 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={26} color={colors.textPrimary}/>
                    </Pressable>
                </View>
                <DogMatchCard match={match}
                />

                {loadingApplication ? (
                    <View
                        accessibilityRole="progressbar"
                        accessibilityState={{busy : true}}
                        accessibilityLabel="Loading application"
                    > 
                        <ActivityIndicator style={styles.loadingIndicator} />
                    </View>
                ) : (
                    <Pressable 
                        accessibilityLabel={`${existingApplication ? "View Application" : "Apply to Adopt"}`}
                        accessibilityRole="button"
                        onPress={handleApplyPress} 
                        style={styles.applyButton}
                    >
                        <Text style={typography.button}>{existingApplication ? "View Application" : "Apply to Adopt"}</Text>
                    </Pressable>
                )}
            </View> 
        </SafeAreaView>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.md,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    backButton: {
        minHeight: 48,
        minWidth: 48,
        padding: spacing.sm,
    },
    loadingIndicator: {
        marginTop: spacing.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    buttonWrapper: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    applyButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
})