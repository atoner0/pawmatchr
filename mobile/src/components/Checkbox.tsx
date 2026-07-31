import { Text, Pressable, View, StyleSheet } from "react-native"


type Props = {
    label: string;
    isChecked: boolean;
    onPress: () => void;
}

export function CheckBox({ label, isChecked, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={isChecked ? styles.checked : styles.unchecked}/>
            <Text>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    checked: {
        backgroundColor: '#5b5757'
    },
    unchecked: {
        backgroundColor: '#cac6c6'
    }
});

