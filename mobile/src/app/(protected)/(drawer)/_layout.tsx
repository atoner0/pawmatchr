import { Drawer } from "expo-router/drawer";
import { useNavigation, DrawerActions } from "expo-router/build/react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import HeaderTitle from "@/components/navigation/HeaderTitle";
import { colors, spacing } from "@/constants/theme";
import { getFocusedRouteNameFromRoute } from "expo-router/build/react-navigation";

const titleMap: Record<string, string> = {
    home: "Pawmatchr",
    "matches/swipe": "Pawmatchr",
    "matches/ranked": "My Favourites",
    applications: "My Applications",
    bookings: "My Bookings",
    support: "Support Materials",
    settings: "Settings",
    profile: "My Profile"
}

export default function DrawerLayout() {
  return (
    <Drawer
        screenOptions={{
            headerStyle: { backgroundColor: colors.background},
            headerShadowVisible: false,
            headerLeft: () => {
                const navigation = useNavigation();
                return (
                  <Pressable
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    style={styles.toggleButton}
                    accessibilityRole="button"
                    accessibilityLabel="Open navigation menu"
                >
                    <Ionicons name="menu-outline" size={26} color={colors.navyDark} />
                </Pressable>  
                );
            },
            headerRight: () => (
                <View style={{ paddingRight: spacing.md }}>
                    <Ionicons name="notifications-outline" size={24} color={colors.navyDark} />
                </View>
            ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen 
            name="(tabs)"
            options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "home";
                const title = titleMap[routeName] ?? "Pawmatchr";
                return {
                    headerTitle: () => <HeaderTitle title={title} />
                }
            }}
        />
    </Drawer>
  );
}

const styles = StyleSheet.create({
    toggleButton: {
        minWidth: 48,
        minHeight: 48,
        justifyContent: "center",
        alignItems: "center"
    }
})