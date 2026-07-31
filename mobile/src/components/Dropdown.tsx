import { Text, Pressable, View, StyleSheet } from "react-native"
import { Option } from "@/constants/questionnaireOptions"
import { Picker } from '@react-native-picker/picker';

type Props<T> = {
    label: string;
    options: Option<T>[];
    value: T | undefined;
    onChange: (value: T) => void;
    error?: string
}

export function Dropdown<T>({ label, options, value, onChange, error}: Props<T>) {
    return (
        <View>
            <Text>{label}</Text>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
            >
                {options.map((option) => (
                    <Picker.Item key={option.value as string} label={option.label} value={option.value} />
                ))}
            </Picker>
            {error && <Text style={{ color: "red"}}>{error}</Text>}
        </View>
    )
    
}
