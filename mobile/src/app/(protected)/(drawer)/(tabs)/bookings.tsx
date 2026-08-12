import BookingRow from "@/components/booking/BookingRow";
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
                <Text>You haven't booked any visits yet</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={bookings}
            keyExtractor={(item) => String(item.booking_id)}
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
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        color: "#d33",
        fontSize: 15,
        textAlign: "center",
    },
})