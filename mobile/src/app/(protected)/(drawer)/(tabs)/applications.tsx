import ApplicationRow from "@/components/application/ApplicationRow";
import { colors, spacing, typography } from "@/constants/theme";
import { getApplications } from "@/lib/applications";
import { ApplicationWithDetails } from "@/types/application";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";

export default function Applications() {

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

    if (applications.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={typography.placeholder}>You haven't submitted any applications yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={applications}
                keyExtractor={(item) => String(item.application_id)}
                contentContainerStyle={styles.listContent}
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
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    },
    errorText: {
        color: colors.danger,
        fontSize: 15,
        textAlign: "center",
    },
});