import { CheckBox } from "@/components/questionnaire/Checkbox";
import { readinessChecklistSections } from "@/constants/readinessChecklistItems";
import { updateChecklist } from "@/lib/applications";
import { MatchWithDog } from "@/types/match";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

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
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32}}>
            <View>
                {readinessChecklistSections.map((section) => (
                    <View key = {section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
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
                        onPress={onSubmit} 
                        disabled={loading}
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    >
                        <Text style={styles.submitButtonText}>{loading ? "Submitting..." : "Submit"}</Text>
                    </Pressable>
                )}

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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 6,
    },
    sectionInfo: {
        fontSize: 14,
        lineHeight: 20,
        color: "#555",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: "#2563eb",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 12,
    },
    submitButtonDisabled: {
        backgroundColor: "#93b4f0",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#d33",
        marginTop: 10,
        textAlign: "center",
    },
});