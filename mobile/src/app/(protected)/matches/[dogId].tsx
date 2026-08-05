import { useLocalSearchParams } from "expo-router";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react";
import { ApplicationWithDetails } from "@/types/application";
import { getApplications } from "@/lib/applications";

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
        <View style={{ flex: 1, paddingTop: 16 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 16}}>
                <Ionicons name="chevron-back" size={20}/>
            </Pressable>
            <DogMatchCard match={match}/>

            {loadingApplication ? (
                <ActivityIndicator style={{ marginTop: 16 }} />
            ) : (
                <Pressable onPress={handleApplyPress} style={{ padding: 16, marginTop: 16 }}>
                    <Text>{existingApplication ? "View Application" : "Apply to Adopt"}</Text>
                </Pressable>
            )}
        </View>
        
    )
}