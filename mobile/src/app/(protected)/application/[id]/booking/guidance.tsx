import CatIntegrationSection from "@/components/application/CatIntegrationSection";
import DogIntroSection from "@/components/application/DogIntroSection";
import { useAdopter } from "@/context/AdopterContext";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

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
        <ScrollView style={styles.container}>
            {hasResidentDog && <DogIntroSection />}
            {hasResidentCat && <CatIntegrationSection />}

            {hasResidentDog ? (
                <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>I've Read This Guidance</Text>
                </Pressable>
            ) : (
                <Pressable onPress={() => router.back()} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Back to Applications</Text>
                </Pressable>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9f8",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    confirmButton: {
        backgroundColor: "#1f3d3a",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 32,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});