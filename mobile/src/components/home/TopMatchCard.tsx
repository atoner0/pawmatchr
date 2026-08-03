import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons"

type Props = {
    match: MatchWithDog;
    onPress: () => void;
}

export default function TopMatchCard({ match, onPress }: Props) {
    const { dog, overall_score } = match;
    const scorePercent = Math.round(overall_score * 100);
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={styles.title}>Your top match</Text>
                    <Text style={styles.name}>{dog.name} - {scorePercent}%</Text>
                </View>
                <Ionicons name="chevron-forward" size={20}/>
            </View>
        </Pressable>
            
    )
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
    },
    photo: { 
        width: 72, 
        height: 72, 
        borderRadius: 12
    },
    textBlock: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
    },
    title: {
        fontSize: 14, 
        color: "#555",
        marginTop: 2,
    },
})

