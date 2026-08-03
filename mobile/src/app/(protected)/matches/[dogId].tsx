import { useLocalSearchParams } from "expo-router";
import DogMatchCard from "@/components/matches/DogMatchCard";
import { MatchWithDog } from "@/types/match";

export default function DogDetailScreen() {
    const params = useLocalSearchParams<{ dogId: string; match: string }>();
    const match: MatchWithDog = JSON.parse(params.match);

    return <DogMatchCard match={match}/>;
}