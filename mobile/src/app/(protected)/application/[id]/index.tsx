import ApplicationStepper, { StepperStep } from "@/components/application/ApplicationStepper";
import { applicationStatusLabels, bookingStatusLabels, bookingTypeLabels } from "@/constants/statusLabels";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { useAdopter } from "@/context/AdopterContext";
import { getApplicationById, withdrawApplication } from "@/lib/applications";
import { getBookingsByApplication } from "@/lib/bookings";
import { formatDate } from "@/lib/formatDate";
import { capitaliseFirst } from "@/lib/formatText";
import { ApplicationWithDetails } from "@/types/application";
import { BookingWithDetails } from "@/types/booking";
import { BookingType } from "@/types/bookingSchema";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewApplication() {
    const params = useLocalSearchParams<{ id: string }>();
    const applicationId = Number(params.id);

    const [application, setApplication] = useState<ApplicationWithDetails | null>(null);
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);

    useEffect(() => {
        const fetchApplicationData = async () => {
            setLoading(true);
            setError("");

            try {
                const [applicationData, bookingsData] = await Promise.all([
                    getApplicationById(applicationId),
                    getBookingsByApplication(applicationId),
                ]);

                setApplication(applicationData);
                setBookings(bookingsData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load application."
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, [applicationId]);
    
    const {adopter} = useAdopter();

    const needsPetIntroduction = adopter?.current_pet_type?.includes('dog') === true;

    const requiredBookingTypes: BookingType[] = needsPetIntroduction 
        ? ['initial_meet', 'home_check', 'pet_introduction']
        : ['initial_meet', 'home_check']

    const getBookingForType = (type: BookingType): BookingWithDetails | undefined => {
        return bookings.find((b) => b.booking_type === type);
    };

    const completeCount = requiredBookingTypes.filter((type) => {
        const booking = getBookingForType(type);
        return booking?.status === "completed";
    }).length;

    const nextBookingType = requiredBookingTypes.find((type) => !getBookingForType(type));

    const petIntroBooking = getBookingForType("pet_introduction")
    const showGuidanceBanner = nextBookingType === 'pet_introduction' && !petIntroBooking

    const handleBookVisitPress = () => {
        if(!nextBookingType) return;

        if (nextBookingType === 'pet_introduction' && !petIntroBooking) {
            router.push({
                pathname: "/(protected)/application/[id]/booking/guidance",
                params: { id: String(applicationId), shelterId: String(application?.shelter_id) },
            });
        } else {
            router.push({
                pathname: "/(protected)/application/[id]/booking/calendar",
                params: { 
                    id: String(applicationId), 
                    shelterId: String(application?.shelter_id),
                    bookingType: nextBookingType,
                },
            });
        }
    };

    const handleWithdraw = () => {
        Alert.alert(
            "Withdraw Application",
            "Are you sure you want to withdraw this application? This cannot be undone",
            [
                { text: "cancel", style: "cancel" },
                {
                    text: "Withdraw",
                    style: "destructive",
                    onPress: async () => {
                        setWithdrawing(true);
                        try {
                            const updated = await withdrawApplication(applicationId);
                            setApplication(updated);
                        } catch (err) {
                            const errorMessage = err instanceof Error ? err.message : "Failed to withdraw application";
                            setError(errorMessage);
                        } finally {
                            setWithdrawing(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !application) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || "Application not found"}</Text>
            </View>
        )
    }

    const decisionState: StepperStep["state"] =
        application.status === "approved" || application.status === "adopted"
            ? "complete"
            : application.status === "rejected" || application.status === "withdrawn"
            ? "complete"
            : "pending";

    const steps: StepperStep[] = [
        { label: "Submitted", state: "complete" },
        {label: "Checklist", state: application.readiness_checklist ? "complete" : "pending" },
        {
            label: "Visits",
            state: "in_progress",
            countLabel: `${completeCount}/${requiredBookingTypes.length}`,
        },
        { label: "Decision", state: decisionState}
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView>
                <View style={styles.header}>
                    <Pressable onPress={() => router.replace("/(protected)/(drawer)/(tabs)/applications")}>
                        <Ionicons name="chevron-back" size={22} color={colors.textPrimary}/>
                    </Pressable>
                    <Text style={styles.headerTitle}>My Application</Text>
                    <Ionicons name="notifications-outline" size={22} color={colors.textPrimary}/>
                </View>

                <Image source={{ uri: application.photo_url }} style={styles.dogImage} />

                <View style={styles.dogInfoRow}>
                    <Text style={typography.cardTitle}>{application.dog_name}</Text>
                    <Text style={typography.cardSubtitle}>{application.breed} | {capitaliseFirst(application.gender)}</Text>
                </View>

                <View style={styles.shelterRow}>
                    <View style={styles.shelterPill}>
                        <Ionicons name="location-outline" size={14} />
                        <Text style={styles.shelterText}>{application.shelter_name}, {application.shelter_city}</Text>
                    </View>
                    <Text style={typography.cardSubtitle}>Applied {formatDate(application.submitted_at)}</Text>
                </View>

                <View style={styles.progressRow}>
                    <Text style={typography.sectionTitle}>PROGRESS</Text>
                    <View style={styles.statusPill}>
                        <Text style={styles.statusPillText}>{applicationStatusLabels[application.status]}</Text>
                    </View>
                </View>

                <ApplicationStepper steps={steps} />

                <View style={styles.bookingsBox}>
                    {requiredBookingTypes.map((type) => {
                        const booking = getBookingForType(type);
                        return (
                            <View key={type} style={styles.bookingRow}>
                                <Text style={typography.value}>{bookingTypeLabels[type]}</Text>
                                {booking ? (
                                    <Text style={booking.status == "completed" ? styles.bookingCompleted : styles.bookingPending}>
                                        {booking.status === "completed"
                                            ?  `Completed ${booking.slot}`
                                            : bookingStatusLabels[booking.status]}
                                    </Text>
                                ) : (
                                    <Text style={styles.bookingNotBooked}>Not booked</Text>
                                )}
                            </View>
                        );
                    })}
                </View>

                {showGuidanceBanner && (
                    <View style={styles.guidanceBanner}>
                        <Text style={styles.guidanceText}>
                            You must read the multi-pet guidance before booking your pet introduction
                        </Text>
                    </View>
                )}
                {nextBookingType ? (
                    <Pressable onPress={handleBookVisitPress} style={styles.bookButton}>
                        <Text style={typography.button}>Book Visit</Text>
                    </Pressable>
                ) : (
                    <View style={styles.allBookedBox}>
                        <Text style={styles.allBookedText}>
                            All required visits are booked.
                        </Text>
                    </View>
                )}

                

                <Pressable onPress={handleWithdraw} disabled={withdrawing}>
                    <Text style={styles.withdrawText}>
                        {withdrawing ? "Withdrawing..." : "Withdraw Application"}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
        
        
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textPrimary
    },
    dogImage: {
        width: "100%",
        height: 200,
        borderRadius: radii.lg,
        marginTop: spacing.sm,
    },
    dogInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm + 4,
    },
    shelterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm + 4,
    },
    shelterPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        backgroundColor: colors.card,
        borderRadius: radii.pill,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 2,
    },
    shelterText: {
        fontSize: 13,
        color: colors.textPrimary,
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        marginTop: spacing.lg,
    },
    statusPill: {
        backgroundColor: colors.accentOrange,
        borderRadius: radii.md,
        paddingHorizontal: spacing.sm + 4,
        paddingVertical: spacing.xs + 2,
    },
    statusPillText: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.textOnDark,
    },
    bookingsBox: {
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm + 2,
        padding: spacing.md,
    },
    bookingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.cardBorder,
    },
    bookingCompleted: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    bookingPending: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    bookingNotBooked: {
        fontSize: 13,
        color: colors.danger,
        fontWeight: "600",
    },
    guidanceBanner: {
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm + 6,
        padding: spacing.md,
    },
    guidanceText: {
        fontSize: 14,
        textAlign: "center",
        color: colors.textPrimary,
    },
    bookButton: {
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    withdrawText: {
        color: colors.danger,
        fontSize: 16,
        textAlign: "center",
        marginTop: spacing.sm + 6,
        marginBottom: spacing.lg,
        fontWeight: "700",
    },
    allBookedBox: {
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        padding: spacing.md,
    },
    allBookedText: {
        fontSize: 14,
        textAlign: "center",
        color: colors.textPrimary,
    },
});