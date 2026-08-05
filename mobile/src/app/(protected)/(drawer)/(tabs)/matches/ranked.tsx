import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { MatchWithDog } from "@/types/match";
import { getFavourites } from "@/lib/favourites"; 
import FavouriteRow from "@/components/matches/FavouriteRow";
import { Ionicons } from "@expo/vector-icons"

export default function RankedScreen() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchWithDog[]>([]);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
        (async () => {
            const results = await getFavourites();
            setMatches(results);
            setLoading(false);
        })();
    }, []);

    if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    
    if (matches.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>You haven't favourited any dogs yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{paddingTop: 16 }}>
                <Pressable onPress={() => router.back()} style={{ padding: 16}}>
                    <Ionicons name="chevron-back" size={20}/>
                </Pressable>
            </View>
            
            <FlatList
                data={matches}
                keyExtractor={(item) => item.match_id.toString()}
                renderItem={({ item }) => (
                    <FavouriteRow
                        match={item}
                        onPress={() => {
                            router.push({
                                pathname: "/matches/[dogId]",
                                params: {
                                    dogId: item.dog_id.toString(),
                                    match: JSON.stringify(item)
                                }
                            })
                        }}
                    />
                )}
            />

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
