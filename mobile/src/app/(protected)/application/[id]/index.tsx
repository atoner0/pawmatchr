import ApplicationStepper, { StepperStep } from "@/components/application/ApplicationStepper";
import { applicationStatusLabels, bookingStatusLabels, bookingTypeLabels } from "@/constants/statusLabels";
import { useAdopter } from "@/context/AdopterContext";
import { getApplicationById, withdrawApplication } from "@/lib/applications";
import { getBookingsByApplication } from "@/lib/bookings";
import { formatDate } from "@/lib/formatDate";
import { ApplicationWithDetails } from "@/types/application";
import { BookingWithDetails } from "@/types/booking";
import { BookingType } from "@/types/bookingSchema";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Image, Alert } from "react-native";

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

    const needsPetIntroduction = adopter?.current_pets === true;

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

    const petIntroBooking = getBookingForType("pet_introduction")
    const showGuidanceBanner = needsPetIntroduction && !petIntroBooking

    const handleBookVisitPress = () => {
        if (showGuidanceBanner) {
            router.push({
                pathname: "/(protected)/application/[id]/booking/guidance",
                params: { id: String(applicationId)},
            });
        } else {
            router.push({
                pathname: "/(protected)/application/[id]/booking/calendar",
                params: { id: String(applicationId)},
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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} />
                </Pressable>
                <Text style={styles.headerTitle}>My Application</Text>
                <Ionicons name="notifications-outline" size={22} />
            </View>

            <Image source={{ uri: application.photo_url }} style={styles.dogImage} />

            <View style={styles.dogInfoRow}>
                <Text style={styles.dogName}>{application.dog_name}</Text>
                <Text style={styles.breedGender}>{application.breed} | {application.gender}</Text>
            </View>

            <View style={styles.shelterRow}>
                <View style={styles.shelterPill}>
                    <Ionicons name="location-outline" size={14} />
                    <Text style={styles.shelterText}>{application.shelter_name}, {application.shelter_city}</Text>
                </View>
                <Text style={styles.appliedDate}>Applied {formatDate(application.submitted_at)}</Text>
            </View>

            <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>PROGRESS</Text>
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
                            <Text style={styles.bookingType}>{bookingTypeLabels[type]}</Text>
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

            <Pressable onPress={handleBookVisitPress} style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Visit</Text>
            </Pressable>

            <Pressable onPress={handleWithdraw} disabled={withdrawing}>
                <Text style={styles.withdrawText}>
                    {withdrawing ? "Withdrawing..." : "Withdraw Application"}
                </Text>
            </Pressable>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9f8",
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    dogImage: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginTop: 8,
    },
    dogInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        marginTop: 12,
    },
    dogName: {
        fontSize: 22,
        fontWeight: "700",
    },
    breedGender: {
        fontSize: 14,
        color: "#555",
    },
    shelterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 10,
    },
    shelterPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    shelterText: {
        fontSize: 13,
        color: "#333",
    },
    appliedDate: {
        fontSize: 13,
        color: "#555",
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 20,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    statusPill: {
        backgroundColor: "#f4a462",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusPillText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#fff",
    },
    bookingsBox: {
        backgroundColor: "#fdf3e8",
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 10,
        padding: 16,
    },
    bookingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    bookingType: {
        fontSize: 14,
        fontWeight: "600",
    },
    bookingCompleted: {
        fontSize: 13,
        color: "#2d6a4f",
    },
    bookingPending: {
        fontSize: 13,
        color: "#a67c00",
    },
    bookingNotBooked: {
        fontSize: 13,
        color: "#d33",
    },
    guidanceBanner: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 14,
        padding: 16,
    },
    guidanceText: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
    },
    bookButton: {
        backgroundColor: "#1f3d3a",
        borderRadius: 30,
        marginHorizontal: 16,
        marginTop: 16,
        paddingVertical: 14,
        alignItems: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    withdrawText: {
        color: "#c0392b",
        fontSize: 14,
        textAlign: "center",
        marginTop: 14,
        marginBottom: 24,
        fontWeight: "600",
    },
});