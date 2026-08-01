import { View, Text, StyleSheet } from "react-native";


type Props = {
    label: string;
    tags: string[];
};

export default function TagList({ label, tags }: Props) {
    if (tags.length === 0) return null

    return (
       <View style={styles.section}>
        <Text style={styles.heading}>{label}</Text>
        <View style={styles.tagRow}>
            {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                </View>
            ))}
        </View>
       </View> 
    )
}

const styles = StyleSheet.create({
    section: { 
        marginTop: 12,
    },
    heading: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tag: {
        backgroundColor: "#f4c7c3",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    tagText: {
        fontSize: 13,
    },
})