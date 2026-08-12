import { Drawer, DrawerToggleButton } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import HeaderTitle from "@/components/navigation/HeaderTitle";
import { colors, spacing } from "@/constants/theme";

export default function DrawerLayout() {
  return (
    <Drawer
        screenOptions={{
            headerTitle: () => <HeaderTitle title="Pawmatchr" />,
            headerStyle: { backgroundColor: colors.background},
            headerShadowVisible: false,
            headerRight: () => (
                <View style={{ paddingRight: spacing.md }}>
                    <Ionicons name="notifications-outline" size={24} color={colors.navyDark} />
                </View>
            ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen name="(tabs)"/>
    </Drawer>
  );
}
