import { View, Text, Image, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    match: MatchWithDog;
};

export default function MatchHeader({ match }: Props) {
    const { dog, shelter, overall_score, explanation } = match;
    const scorePercent = Math.round(overall_score * 100);

    return (
        <View>
            <View style={styles.photoContainer}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{scorePercent}%</Text>
                </View>
            </View>

            <View style={styles.nameRow}>
                <Text style={styles.name}>{dog.name}</Text>
                <Text style={styles.breedGender}>
                    {dog.breed} | {dog.gender}
                </Text>
            </View>

            <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>{explanation}</Text>
            </View>

            <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} />
                <Text style={styles.locationText}>
                    {shelter.name}, {shelter.city}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    photoContainer: { 
        position: 'relative' 
    },
    photo: { 
        width: '100%', 
        height: 240, 
        borderRadius: 16
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: "#0a3b30",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "600",
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginTop: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
    },
    breedGender: {
        fontSize: 14, 
        color: "#555"
    },
    explanationBox: {
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    explanationText: {
        fontSize: 14,
        lineHeight: 20,
    },
    locationRow: {
        marginTop: 10,
    },
    locationText: {
        fontSize: 13,
        color: "#666"
    }
})