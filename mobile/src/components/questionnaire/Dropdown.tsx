import { Text, Pressable, View, StyleSheet } from "react-native"
import { Option } from "@/constants/questionnaireOptions"
import { Picker } from '@react-native-picker/picker';
import { colors, radii, spacing, typography } from "@/constants/theme";

type Props<T> = {
    title: string,
    label: string;
    options: Option<T>[];
    value: T | undefined;
    onChange: (value: T) => void;
    error?: string
}

export function Dropdown<T>({ title, label, options, value, onChange, error}: Props<T>) {
    return (
        <View style={styles.field}>
            <Text style={typography.label}>{label}</Text>
            <View style={styles.pickerWrapper}>
               <Picker
                    selectedValue={value ?? ""}
                    onValueChange={(itemValue) => {
                        if (itemValue === "") return
                        onChange(itemValue as T)
                    }}
                    style={styles.picker}
                    accessibilityLabel={title}
                >
                    <Picker.Item label={`Select ${title}...`} value= "" enabled={false} color={colors.placeholder}/>
                    {options.map((option) => (
                        <Picker.Item key={option.value as string} label={option.label} value={option.value} />
                    ))}
                </Picker> 
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    ) 
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    field: {
       gap: spacing.sm,
    },
    pickerWrapper: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        overflow: "hidden",
    },
    picker: {
        color: colors.textPrimary,
    },
    errorText: {
        color: colors.danger,
        fontSize: 13,
    },
});
