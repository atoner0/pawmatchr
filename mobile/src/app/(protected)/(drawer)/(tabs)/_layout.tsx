import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#FFFFFF",
                tabBarInactiveTintColor: colors.navyMuted,
                tabBarStyle: {
                    backgroundColor: colors.navyDark,
                    borderTopWidth: 0,
                },
            }}    
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    )
                }}
            />

            <Tabs.Screen
                name="matches/ranked"
                options={{
                    title: 'Favourites',
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused ? 'heart-sharp' : 'heart-outline'} color={color} size={24} />
                    )
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused}) => (
                        <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
                    )
                }}
            />

            <Tabs.Screen name="matches/swipe" options={{ href: null }} />
            <Tabs.Screen name="applications" options={{ href: null }} />
            <Tabs.Screen name="bookings" options={{ href: null }} />
            <Tabs.Screen name="support" options={{ href: null }} />
            <Tabs.Screen name="settings" options={{ href: null }} />

        </Tabs>
    )
}