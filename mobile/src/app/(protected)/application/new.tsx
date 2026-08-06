import MatchHeader from "@/components/matches/MatchHeader";
import TagList from "@/components/matches/TagList";
import { ApiError } from "@/lib/api";
import { createApplication } from "@/lib/applications";
import { MatchWithDog } from "@/types/match";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";

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

        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            <View>
                <MatchHeader match={match} />

                
                <Text style={styles.introText}>You're applying to adopt {match.dog.name}</Text>
                

                {match.warnings.length > 0 && (
                    <View style={styles.warningBox}>
                        <Text style={styles.title}>This dog has the following warnings:</Text>
                        {match.warnings.map((warning, i) => (
                            <Text key={i} style={styles.warningText}>{warning}</Text>
                        ))}
                    </View>
                )}

                {(match.dog.medical_issues.length > 0 || match.dog.behavioural_flags.length > 0 || match.dog.known_triggers.length > 0) && (
                    <View style={styles.warningBox}>
                        <Text style={styles.title}>Things to Know</Text>
                        <TagList label="Medical Issues" tags={match.dog.medical_issues}/>
                        <TagList label="Behavioural Issues" tags={match.dog.behavioural_flags}/>
                        <TagList label="Known Triggers" tags={match.dog.known_triggers}/>
                    </View>
                )}

                {match.dog.medical_issues.length > 0 && (
                    <View style={styles.warningBox}>
                        <Text style={styles.title}>This dog has the following medical issues:</Text>
                        {match.dog.medical_issues.map((issue, i) => (
                            <Text key={i} style={styles.warningText}>{issue}</Text>
                        ))}
                        {match.dog.medical_notes ? (
                            <Text style={styles.warningText}>{match.dog.medical_notes}</Text>
                        ): null}
                        
                    </View>
                )}


                <View style={styles.nextStepsBox}>
                    <Text style={styles.nextStepsTitle}>What's next if you apply:</Text>
                    <Text style={styles.nextStepItem}>1. Readiness checklist</Text>
                    <Text style={styles.nextStepItem}>2. Visit bookings</Text>
                    <Text style={styles.nextStepItem}>3. Shelter review</Text>
                </View>

                <Pressable 
                    onPress={handleApplyPress} 
                    disabled={loading} 
                    style={[styles.applyButton, loading && styles.applyButtonDisabled]}
                >
                    <Text style={styles.applyButtonText}>{loading ? "Applying..." : "Apply"}</Text>
                </Pressable>

                <Pressable onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    introText: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    warningBox: {
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    warningText: {
        fontSize: 14,
        lineHeight: 20,
    },
    nextStepsBox: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
    },
    nextStepsTitle: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 6,
    },
    nextStepItem: {
        fontSize: 14,
        lineHeight: 22,
        color: "#333",
    },
    applyButton: {
        backgroundColor: "#2563eb",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },
    applyButtonDisabled: {
        backgroundColor: "#93b4f0",
    },
    applyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#555",
        fontSize: 15,
        fontWeight: "500",
    },
    errorText: {
        color: "#d33",
        marginTop: 10,
        textAlign: "center",
    },
})