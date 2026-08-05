import MatchHeader from "@/components/matches/MatchHeader";
import { createApplication } from "@/lib/applications";
import { MatchWithDog } from "@/types/match";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";

export default function NewApplication() {
    const params = useLocalSearchParams<{ dogId: string; match: string }>();
    const match: MatchWithDog = JSON.parse(params.match);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const handleApplyPress = async () => {
        try {
            const application = await createApplication(match.dog_id);

            router.replace({
                pathname: "/(protected)/application/[id]",
                params: { id: String(application.application_id)}
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
            setError(errorMessage);
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <MatchHeader match={match} />

            <View>
                <Text>You're applying to adopt {match.dog.name}</Text>
            </View>

            {match.warnings.length > 0 && (
                <View style={styles.warningBox}>
                    <Text style={styles.title}>This dog has the following warnings:</Text>
                    {match.warnings.map((warning, i) => (
                        <Text key={i} style={styles.warningText}>{warning}</Text>
                    ))}
                </View>
            )}

            <View>
                <Text>What's next if you apply:</Text>
                <Text>Readiness checklist</Text>
                <Text>Visit bookings</Text>
                <Text>Shelter review</Text>
            </View>

            <Pressable onPress={handleApplyPress} disabled={loading} style={{ padding: 16, marginTop: 16 }}>
                <Text>{loading ? "Applying..." : "Apply"}</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={{ padding: 16, marginTop: 16 }}>
                <Text>Cancel</Text>
            </Pressable>

            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
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
})