import { bookingTypeLabels } from "@/constants/statusLabels";
import { BookingWithDetails } from "@/types/booking";
import { View, Text, StyleSheet } from "react-native";
import { formatSlot } from "@/lib/formatDate";

interface Props {
    booking: BookingWithDetails | null;
}

export default function UpcomingVisitCard({ booking }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upcoming Visit</Text>
            {booking ? (
                <Text style={styles.detail}>
                    {bookingTypeLabels[booking.booking_type]} with {booking.dog_name} - {formatSlot(booking.slot)}
                </Text>
            ) : (
                <Text style={styles.placeholder}>No upcoming visits scheduled</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    detail: {
        fontSize: 16,
        color: "#1f3d3a",
        fontWeight: "600",
        marginTop: 4
    },
    placeholder: {
        fontSize: 16,
        color: "#555",
    },
})