import { Text, Pressable, View, StyleSheet } from "react-native"
import { CheckBox } from "./Checkbox"
import { Option } from "@/constants/questionnaireOptions"

type Props<T> = {
    label: string;
    options: Option<T>[];
    value: T[];
    onChange: (value: T[]) => void;
    error?: string;
    noneValue?: T;
}

export function MultiCheckbox<T>({ label, options, value, onChange, error, noneValue }: Props<T> ) {
    const handleToggle = (optionValue: T) => {
        const isSelected = value.includes(optionValue)
        if (isSelected) {
            onChange(value.filter((v) => v !== optionValue))
            return
        }

        if (optionValue === noneValue) {
            onChange([optionValue])
            return
        }
            
        onChange([...value.filter((v) => v !== noneValue), optionValue])
    }

    return (
        <View>
            <Text>{label}</Text>
            {options.map((option) => (
                <CheckBox
                    key={option.value as string}
                    label={option.label}
                    isChecked={value.includes(option.value)}
                    onPress={() => handleToggle(option.value)}
                />
            ))}
            {error && <Text style={{ color: "red"}}>{error}</Text>}
        </View>
    )
}