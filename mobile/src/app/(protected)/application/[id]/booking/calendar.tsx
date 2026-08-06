import { ApiError } from "@/lib/api";
import { getAvailability } from "@/lib/availability";
import { createBooking } from "@/lib/bookings";
import { formatSlot } from "@/lib/formatDate";
import { ApplicationWithDetails } from "@/types/application";
import { Availability } from "@/types/availability";
import { BookingType } from "@/types/bookingSchema";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, SectionList } from "react-native";

export default function BookingCalendar() {
    const params = useLocalSearchParams<{ 
        id: string;
        shelterId: string;
        bookingType: BookingType;
        guidanceRead?: string; 
    }>();
    const applicationId = Number(params.id);
    const shelterId = Number(params.shelterId)

    const [availableSlots, setAvailableSlots] = useState<Availability[]>([])
    const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setError("");

            try {
                const slotsData = await getAvailability(shelterId);
                setAvailableSlots(slotsData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load available slots."
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [shelterId]);

    const groupedSlots = availableSlots.reduce<Record<string, Availability[]>>((groups, slot) => {
        const dayKey = new Date(slot.slot).toDateString();
        if (!groups[dayKey]) groups[dayKey] = [];
        groups[dayKey].push(slot);
        return groups;
    }, {});

    const sections = Object.entries(groupedSlots).map(([day, slots]) => ({
        title: new Date(slots[0].slot).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long"}),
        data: slots,
    }))


    const handleConfirmBooking = async () => {
        if (!selectedSlot || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            const booking = await createBooking(
                Number(params.id),
                selectedSlot.availability_id,
                params.bookingType,
                params.guidanceRead === "true"
            );

            router.replace({
                pathname: "/(protected)/application/[id]",
                params: { id: params.id }
            })
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setError("That slot was just booked by someone else. Please choose another")
                const refreshed = await getAvailability(shelterId);
                setAvailableSlots(refreshed);
                setSelectedSlot(null);
            } else {
                const errorMessage = err instanceof Error ? err.message : "Failed to create booking";
                setError(errorMessage)
            }
            setSubmitting(false);
            
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => String(item.availability_id)}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.dayHeader}>{section.title}</Text>
                )}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => setSelectedSlot(item)}
                        style={[
                            styles.slotRow,
                            selectedSlot?.availability_id === item.availability_id && styles.slotRowSelected
                        ]}
                    >
                        <Text style={styles.slotText}>{formatSlot(item.slot)}</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No available slots right now</Text>}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
                onPress={handleConfirmBooking}
                disabled={!selectedSlot || submitting}
                style={[styles.confirmButton, (!selectedSlot || submitting) && styles.confirmButtonDisabled]}
            >
                <Text style={styles.confirmButtonText}>
                    {submitting ? "Booking..." : "Confirm Booking"}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9f8",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dayHeader: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1f3d3a",
        backgroundColor: "#f7f9f8",
        paddingVertical: 8,
        paddingTop: 16,
    },
    slotRow: {
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    slotRowSelected: {
        borderColor: "#1f3d3a",
        borderWidth: 2,
        backgroundColor: "#eef5f3",
    },
    slotText: {
        fontSize: 15,
        color: "#333",
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginTop: 40,
        fontSize: 14,
    },
    errorText: {
        color: "#d33",
        textAlign: "center",
        marginBottom: 8,
    },
    confirmButton: {
        backgroundColor: "#1f3d3a",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    confirmButtonDisabled: {
        backgroundColor: "#93b4a6",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});