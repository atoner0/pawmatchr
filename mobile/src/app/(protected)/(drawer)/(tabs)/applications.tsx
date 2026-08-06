import ApplicationRow from "@/components/application/ApplicationRow";
import { getApplications } from "@/lib/applications";
import { ApplicationWithDetails } from "@/types/application";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from "react-native";

export default function ApplicationsPlaceholder() {

    const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    useFocusEffect(
        useCallback(() => {
            const fetchApplications = async () => {
                setLoading(true);
                setError("");
                try {
                    const data = await getApplications();
                    console.log("applications length:", data.length, JSON.stringify(data.map(a => a.application_id)));
                    setApplications(data)
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load application."
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchApplications();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (applications.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>You haven't submitted any applications yet</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={applications}
            keyExtractor={(item) => String(item.application_id)}
            renderItem={({ item }) => (
                <ApplicationRow
                    application={item}
                    onPress={() => router.push({
                        pathname: "/(protected)/application/[id]",
                        params: { id: String(item.application_id)}
                    })}
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        color: "#d33",
        fontSize: 15,
        textAlign: "center",
    },
})