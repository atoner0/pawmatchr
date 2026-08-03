import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    title: string
}

export default function HeaderTitle({ title }: Props) {
     return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="paw" size={22} />
            <Text style={{ fontSize: 24 }}>{title}</Text>
        </View>
        )
}