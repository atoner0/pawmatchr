import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { MatchWithDog } from "@/types/match";

type Props = {
    match: MatchWithDog;
    onPress: () => void;
}

export default function FavouriteRow({ match, onPress }: Props) {
    const { dog, overall_score } = match;
    const scorePercent = Math.round(overall_score * 100);
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: dog.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={styles.name}>{dog.name} - {scorePercent}%</Text>
                    <Text style={styles.breedGender}>
                        {dog.breed} | {dog.gender}
                    </Text>
                </View>
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
    breedGender: {
        fontSize: 14, 
        color: "#555",
        marginTop: 2,
    },
})

