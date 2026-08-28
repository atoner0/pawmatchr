import MatchHeader from "@/components/matches/MatchHeader";
import TagList from "@/components/matches/TagList";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { ApiError } from "@/lib/api";
import { createApplication } from "@/lib/applications";
import { MatchWithDog } from "@/types/match";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewApplication() {
    const params = useLocalSearchParams<{ dogId: string; match: string }>();
    const match: MatchWithDog = JSON.parse(params.match);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const handleApplyPress = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const application = await createApplication(match.dog_id);

            router.replace({
                pathname: "/(protected)/application/[id]/checklist",
                params: { id: String(application.application_id)}
            })
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                const existingId = err.body?.application?.application_id;
                if (existingId) {
                    router.replace({
                        pathname: "/(protected)/application/[id]",
                        params: { id: String(existingId)}
                    });
                    return;
                }
            }

            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
            setError(errorMessage);
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <View>
                    <MatchHeader match={match} />

                    <View style={styles.introBlock}>
                       <Text style={styles.introText}>You're applying to adopt {match.dog.name}</Text> 
                    </View>
                    
                    {match.warnings.length > 0 && (
                        <View style={styles.warningBox}>
                            <Text style={typography.sectionTitle}>This dog has the following warnings:</Text>
                            {match.warnings.map((warning, i) => (
                                <Text key={i} style={typography.body}>{warning}</Text>
                            ))}
                        </View>
                    )}

                    {(match.dog.medical_issues.length > 0 || match.dog.behavioural_flags.length > 0 || match.dog.known_triggers.length > 0) && (
                        <View style={styles.warningBox}>
                            <Text style={typography.sectionTitle}>Things to Know</Text>
                            <TagList label="Medical Issues" tags={match.dog.medical_issues}/>
                            <TagList label="Behavioural Issues" tags={match.dog.behavioural_flags}/>
                            <TagList label="Known Triggers" tags={match.dog.known_triggers}/>
                        </View>
                    )}

                    {match.dog.medical_issues.length > 0 && (
                        <View style={styles.warningBox}>
                            <Text style={typography.sectionTitle}>This dog has the following medical issues:</Text>
                            {match.dog.medical_issues.map((issue, i) => (
                                <Text key={i} style={typography.body}>{issue}</Text>
                            ))}
                            {match.dog.medical_notes ? (
                                <Text style={typography.body}>{match.dog.medical_notes}</Text>
                            ): null}
                            
                        </View>
                    )}

                    <View style={styles.nextStepsBox}>
                        <Text style={styles.nextStepsTitle}>What's next if you apply:</Text>
                        <Text style={styles.nextStepItem}>1. Readiness checklist</Text>
                        <Text style={styles.nextStepItem}>2. Visit bookings</Text>
                        <Text style={styles.nextStepItem}>3. Shelter review</Text>
                    </View>

                    <View style={styles.buttonGroup}>
                        <Pressable
                            accessibilityLabel={"Apply button"}
                            accessibilityRole="button" 
                            onPress={handleApplyPress} 
                            disabled={loading} 
                            style={[styles.applyButton, loading && styles.applyButtonDisabled]}
                        >
                            <Text style={typography.button}>{loading ? "Applying..." : "Apply"}</Text>
                        </Pressable>

                        <Pressable
                            accessibilityLabel={"Cancel button"}
                            accessibilityRole="button" 
                            onPress={() => router.back()} 
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                        

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
    },
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    introBlock: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    introText: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    warningBox: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.md,
        marginTop: spacing.sm,
    },
    nextStepsBox: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.md,
        marginTop: spacing.sm,
    },
    nextStepsTitle: {
        ...typography.sectionTitle,
        marginBottom: spacing.xs + 2,
    },
    nextStepItem: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.textPrimary,
    },
    buttonGroup: {
        gap: spacing.sm,
        marginTop: spacing.sm
    },
    applyButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    applyButtonDisabled: {
        backgroundColor: colors.navyMuted,
    },
    cancelButton: {
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: "500",
    },
    errorText: {
        color: colors.danger,
        textAlign: "center",
    },
})