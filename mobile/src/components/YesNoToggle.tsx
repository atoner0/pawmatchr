import { Text, Pressable, View, StyleSheet } from "react-native"

type Props = {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export function YesNoToggle({ label, value, onChange}: Props) {
    return (
        <View>
            <Text>{label}</Text>
            <View style={{ flexDirection: "row", gap: 12}}>
                <Pressable
                    onPress={() => onChange(true)}
                    style={value === true ? styles.selected : styles.unselected}
                >
                    <Text>Yes</Text>
                </Pressable>
                <Pressable
                    onPress={() => onChange(false)}
                    style={value === false ? styles.selected : styles.unselected}
                >
                    <Text>Yes</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    selected: {
        backgroundColor: '#5b5757'
    },
    unselected: {
        backgroundColor: '#cac6c6'
    }
});