import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <Drawer
        screenOptions={{
            headerTitle: "Pawmatchr",
            headerRight: () => (
                <View style={{ paddingRight: 16 }}>
                    <Ionicons name="notifications-outline" size={24} />
                </View>
            ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen name="home"/>
    </Drawer>
  );
}