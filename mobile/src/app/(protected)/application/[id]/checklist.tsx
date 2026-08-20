import { CheckBox } from "@/components/questionnaire/Checkbox";
import { readinessChecklistSections } from "@/constants/readinessChecklistItems";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { updateChecklist } from "@/lib/applications";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReadinessChecklist() {
    const params = useLocalSearchParams<{ id: string }>();
    const applicationId = Number(params.id);

    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const toggleItem = (id: string) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    const totalItems = readinessChecklistSections.reduce(
        (sum, section) => sum + section.items.length,
        0
    );

    const allChecked = checkedItems.size === totalItems;

    const onSubmit = async () => {
        setLoading(true)
        try {
            await updateChecklist(applicationId, true);

            router.replace({
                pathname: "/(protected)/application/[id]",
                params: { id: String(applicationId) }
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
            setError(errorMessage);
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                    <Pressable
                        accessibilityLabel={"Back button"}
                        accessibilityRole="button" 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={26} color={colors.textPrimary}/>
                    </Pressable>
                    <Text style={styles.headerTitle}>Readiness Checklist</Text>
                    <View style={styles.headerSpacer} />  
                </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View>
                    {readinessChecklistSections.map((section) => (
                        <View key = {section.title} style={styles.section}>
                            <Text style={typography.sectionTitle}>{section.title}</Text>
                            {section.info && <Text style={styles.sectionInfo}>{section.info}</Text>}
                            {section.items.map((item) => (
                                <CheckBox 
                                    key={item.id} 
                                    label={item.label} 
                                    isChecked={checkedItems.has(item.id)} 
                                    onPress={() => toggleItem(item.id)} 
                                />
                            ))}
                        </View>
                    ))}

                    {allChecked && (
                        <Pressable
                            accessibilityLabel={"Submit button"}
                            accessibilityRole="button" 
                            onPress={onSubmit} 
                            disabled={loading}
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        >
                            <Text style={typography.button}>{loading ? "Submitting..." : "Submit"}</Text>
                        </Pressable>
                    )}

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                </View>
            </ScrollView>
        </SafeAreaView>
        
        
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    backButton: {
        minHeight: 48,
        minWidth: 48,
        padding: spacing.sm,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 22,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    section: {
        gap: spacing.sm,
    },
    sectionInfo: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
    },
    submitButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    submitButtonDisabled: {
        backgroundColor: colors.navyMuted,
    },
    errorText: {
        color: colors.danger,
        textAlign: "center",
    },
});