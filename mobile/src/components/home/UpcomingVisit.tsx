import { bookingTypeLabels } from "@/constants/statusLabels";
import { BookingWithDetails } from "@/types/booking";
import { View, Text, StyleSheet } from "react-native";
import { formatSlot } from "@/lib/formatDate";
import { colors, spacing, radii } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    booking: BookingWithDetails | null;
}

export default function UpcomingVisitCard({ booking }: Props) {
    return (
        <View style={styles.container}>
            {booking ? (
                <>
                    <View style={styles.textBlock}>
                        <Text style={styles.detail}>
                            {bookingTypeLabels[booking.booking_type]} - {booking.dog_name}
                        </Text>
                        <Text style={styles.subDetail}>{formatSlot(booking.slot)}</Text>
                    </View>
                    <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} />
                </>
            ) : (
                <Text style={styles.placeholder}>No upcoming visits scheduled</Text>
            )}
        </View>
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.md,
    },
    textBlock: {
        flex: 1,
    },
    detail: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "600",
    },
    subDetail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    placeholder: {
        fontSize: 15,
        color: colors.textSecondary,
    },
})