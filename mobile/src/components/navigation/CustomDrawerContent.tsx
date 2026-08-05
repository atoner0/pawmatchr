import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAdopter } from "@/context/AdopterContext";
import { router } from "expo-router";
import { clearToken } from "@/lib/auth";
import type { DrawerContentComponentProps } from "expo-router/drawer";


export default function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { adopter } = useAdopter();
    const initials = `${adopter?.first_name?.[0] ?? ""}${adopter?.last_name?.[0] ?? ""}`;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.push("/(protected)/(drawer)/(tabs)/profile")}
            >
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View>
                        <Text style={styles.name}>{adopter?.first_name} {adopter?.last_name}</Text>
                        <Text style={styles.email}>{adopter?.email}</Text>
                    </View>
                </View>
            </Pressable>
            
            <View style={styles.navSection}>
                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/home")}
                >
                    <Ionicons name="home-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Home</Text>
                </Pressable>

                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/matches/swipe")}
                >
                    <Ionicons name="paw-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Matches</Text>
                </Pressable>

                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/matches/ranked")}
                >
                    <Ionicons name="heart-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Favourites</Text>
                </Pressable>

                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/applications")}
                >
                    <Ionicons name="document-text-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Applications</Text>
                </Pressable>

                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/bookings")}
                >
                    <Ionicons name="calendar-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Bookings</Text>
                </Pressable>

                <Pressable 
                    style={styles.navItem}
                    onPress={() => router.push("/(protected)/(drawer)/(tabs)/support")}
                >
                    <Ionicons name="book-outline" size={22} color="#fff"/> 
                    <Text style={styles.navLabel}>Support</Text>
                </Pressable>
            </View>
            
            <View style={styles.divider} />

            <Pressable
                style={styles.navItem} 
                onPress={() => router.push("/(protected)/(drawer)/(tabs)/settings")}
            >
                <Ionicons name="settings-outline" size={22} color="#fff"/> 
                <Text style={styles.navLabel}>Settings</Text>
            </Pressable>

            <View style={styles.spacer} />

            <View style={styles.divider} />

            <Pressable 
            style={styles.signOut}
                onPress={async () => { await clearToken(); router.replace('/(auth)/login'); }}
            >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.signOutText}>Log out</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d3b34",
        paddingTop: 48,
        paddingHorizontal: 16,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#1f5c52",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    name: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    email: {
        color: "#c7d9d5",
        fontSize: 13,
    },
    navSection: {
        gap: 4,
    },
    navItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 24,
    },
    navLabel: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#2a5c53",
        marginVertical: 16,
    },
    spacer: {
        flex: 1,
    },
    signOut: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 16,
        marginBottom: 24,
    },
    signOutText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
})
