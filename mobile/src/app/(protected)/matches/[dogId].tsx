import { useLocalSearchParams } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { router } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"

export default function DogDetailScreen() {
    const params = useLocalSearchParams<{ dogId: string; match: string }>();
    const match: MatchWithDog = JSON.parse(params.match);

    return (
        <View style={{ flex: 1, paddingTop: 16 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 16}}>
                <Ionicons name="chevron-back" size={20}/>
            </Pressable>
            <DogMatchCard match={match}/>
        </View>
        
    )
}