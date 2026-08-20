import CatIntegrationSection from "@/components/application/CatIntegrationSection";
import DogIntroSection from "@/components/application/DogIntroSection";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { useAdopter } from "@/context/AdopterContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MultiPetGuidance() {
    const params = useLocalSearchParams<{ id: string, shelterId: string }>();
    const applicationId = params.id;
    const { adopter } = useAdopter();

    const hasResidentDog = adopter?.current_pet_type?.includes('dog') === true;
    const hasResidentCat = adopter?.current_pet_type?.includes('cat') === true;


    const handleConfirm = () => {
        router.push({
            pathname: "/(protected)/application/[id]/booking/calendar",
            params: { 
                id: applicationId,
                shelterId: params.shelterId,
                bookingType: "pet_introduction",
                guidanceRead: "true"
            }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable 
                        accessibilityLabel={"Back button"}
                        accessibilityRole="button"
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={26} color={colors.textPrimary}/>
                    </Pressable>
                    <Text style={styles.headerTitle}>Multi-Pet Guidance</Text>
                    <View style={styles.headerSpacer} />  
                </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                    {hasResidentDog && <DogIntroSection />}
                    {hasResidentCat && <CatIntegrationSection />}

                    {hasResidentDog ? (
                        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                            <Text style={typography.button}>I've Read This Guidance</Text>
                        </Pressable>
                    ) : (
                        <Pressable onPress={() => router.back()} style={styles.confirmButton}>
                            <Text style={typography.button}>Back to Applications</Text>
                        </Pressable>
                    )}
                </ScrollView> 
            </View>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
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
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
    },
    confirmButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },
});