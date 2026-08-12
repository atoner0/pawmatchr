import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { formatSlot } from "@/lib/formatDate";
import { BookingWithDetails } from "@/types/booking";
import { bookingStatusLabels, bookingTypeLabels } from "@/constants/statusLabels";

type Props = {
    booking: BookingWithDetails;
    onPress: () => void;
}

export default function BookingRow({ booking, onPress }: Props) {  
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <View style={styles.textBlock}>
                    <Text style={styles.dogName}>{booking.dog_name}</Text>
                    <Text style={styles.type}>{bookingTypeLabels[booking.booking_type]}</Text>
                    <Text style={styles.slot}>{formatSlot(booking.slot)}</Text>
                </View>

                <View style={styles.rightBlock}>
                    <Text style={booking.status === "completed" ? styles.statusCompleted : styles.statusPending}>
                        {bookingStatusLabels[booking.status]}
                    </Text>
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
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    textBlock: {
        flex: 1,
    },
    dogName: {
        fontSize: 18,
        fontWeight: "700",
    },
    type: {
        fontSize: 14,
        color: "#555",
        marginTop: 2,
    },
    slot: {
        fontSize: 14,
        color: "#555",
        marginTop: 2,
    },
    rightBlock: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusCompleted: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2d6a4f",
    },
    statusPending: {
        fontSize: 13,
        fontWeight: "600",
        color: "#a67c00",
    },
})

