import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import HeaderTitle from "@/components/navigation/HeaderTitle";

export default function DrawerLayout() {
  return (
    <Drawer
        screenOptions={{
            headerTitle: () => <HeaderTitle title="Pawmatchr" />,
            headerRight: () => (
                <View style={{ paddingRight: 16 }}>
                    <Ionicons name="notifications-outline" size={24} />
                </View>
            ),
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen name="home"/>
        <Drawer.Screen 
            name="matches/swipe" 
            options={{ headerTitle: () => <HeaderTitle title="Matches"/> }} 
        />

        <Drawer.Screen 
            name="matches/ranked" 
            options={{ headerTitle: () => <HeaderTitle title="Favourites"/> }} 
        />
    </Drawer>
  );
}