import BookingRow from "@/components/booking/BookingRow";
import { colors, spacing, typography } from "@/constants/theme";
import { getBookings } from "@/lib/bookings";
import { BookingWithDetails } from "@/types/booking";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";

export default function Bookings() {

    const [bookings, setBookings] = useState<BookingWithDetails[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    useFocusEffect(
        useCallback(() => {
            const fetchBookings = async () => {
                setLoading(true);
                setError("");
                try {
                    const data = await getBookings();
                    setBookings(data)
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load booking."
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchBookings();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (bookings.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={typography.placeholder}>You haven't booked any visits yet</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => String(item.booking_id)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <BookingRow
                        booking={item}
                        onPress={() => router.push({
                            pathname: "/(protected)/application/[id]",
                            params: { id: String(item.application_id)}
                        })}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    errorText: {
        color: colors.danger,
        fontSize: 15,
        textAlign: "center",
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
})