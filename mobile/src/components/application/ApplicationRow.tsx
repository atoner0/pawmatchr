import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { ApplicationWithDetails } from "@/types/application";
import { formatDate } from "@/lib/formatDate";

type Props = {
    application: ApplicationWithDetails;
    onPress: () => void;
}

export default function ApplicationRow({ application, onPress }: Props) {  
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: application.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={styles.name}>{application.dog_name}</Text>
                    <Text style={styles.submitted}>Submitted: {formatDate(application.submitted_at)}</Text>
                    <Text style={styles.submitted}>Status: {application.status}</Text>
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
    submitted: {
        fontSize: 14, 
        color: "#555",
        marginTop: 2,
    },
})

