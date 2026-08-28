import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { formatSlot } from "@/lib/formatDate";
import { BookingWithDetails } from "@/types/booking";
import { bookingStatusLabels, bookingTypeLabels } from "@/constants/statusLabels";
import { colors, radii, spacing, typography } from "@/constants/theme";

type Props = {
    booking: BookingWithDetails;
    onPress: () => void;
}

export default function BookingRow({ booking, onPress }: Props) {  
    return (
        <Pressable onPress = {onPress} style={styles.container}>
                <View style={styles.textBlock}>
                    <Text style={typography.cardTitle}>{booking.dog_name}</Text>
                    <Text style={typography.cardSubtitle}>{bookingTypeLabels[booking.booking_type]}</Text>
                    <Text style={typography.cardSubtitle}>{formatSlot(booking.slot)}</Text>
                </View>

                <View style={styles.rightBlock}>
                    <Text style={booking.status === "completed" ? styles.statusCompleted : styles.statusPending}>
                        {bookingStatusLabels[booking.status]}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary}/>
        </Pressable>
            
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: spacing.sm + 4,
    },
    textBlock: {
        flex: 1,
        gap: 2,
    },
    rightBlock: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    statusCompleted: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.navyMid,
    },
    statusPending: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.textSecondary,
    },
})

