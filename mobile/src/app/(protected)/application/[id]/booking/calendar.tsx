import { colors, radii, spacing, typography } from "@/constants/theme";
import { ApiError } from "@/lib/api";
import { getAvailability } from "@/lib/availability";
import { createBooking } from "@/lib/bookings";
import { formatSlot } from "@/lib/formatDate";
import { ApplicationWithDetails } from "@/types/application";
import { Availability } from "@/types/availability";
import { BookingType } from "@/types/bookingSchema";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <View 
                accessibilityRole="progressbar"
                accessibilityState={{busy : true}}
                accessibilityLabel="Loading application"
                style={styles.centered}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable 
                        accessibilityLabel={"Back button"}
                        accessibilityRole="button"
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={26} color={colors.textPrimary}/>
                    </Pressable>
                    <Text style={styles.headerTitle}>Choose a Slot</Text>
                    <View style={styles.headerSpacer} />
                </View>

            <SectionList
                style={styles.list}
                contentContainerStyle={styles.listContent}
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
                        accessibilityLabel={`${formatSlot(item.slot)} + ${item.availability_id}`}
                    >
                        <Text style={typography.value}>{formatSlot(item.slot)}</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={typography.placeholder}>No available slots right now</Text>}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
                onPress={handleConfirmBooking}
                disabled={!selectedSlot || submitting}
                style={[styles.confirmButton, (!selectedSlot || submitting) && styles.confirmButtonDisabled]}
            >
                <Text style={typography.button}>
                    {submitting ? "Booking..." : "Confirm Booking"}
                </Text>
            </Pressable>
        </View>
        </SafeAreaView>
        
    )
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
    },
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        minHeight: 48,
        minWidth: 48,
        padding: spacing.sm,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 22,
    },
    list: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    listContent: {
        paddingBottom: spacing.md,
    },
    dayHeader: {
        ...typography.sectionTitle,
        backgroundColor: colors.background,
        paddingVertical: spacing.sm,
        paddingTop: spacing.md,
    },
    slotRow: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        paddingVertical: spacing.sm + 6,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    slotRowSelected: {
        borderColor: colors.navyMid,
        borderWidth: 2,
        backgroundColor: colors.navyMuted,
    },
    errorText: {
        color: colors.danger,
        textAlign: "center",
        marginBottom: spacing.xs + 4,
        paddingHorizontal: spacing.md,
    },
    footer: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    confirmButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    confirmButtonDisabled: {
        backgroundColor: colors.navyMuted,
    },
});