import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { ApplicationWithDetails } from "@/types/application";
import { formatDate, formatDateAccessible } from "@/lib/formatDate";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { capitaliseFirst } from "@/lib/formatText";
import { applicationStatusLabels } from "@/constants/statusLabels";

type Props = {
    application: ApplicationWithDetails;
    onPress: () => void;
}

export default function ApplicationRow({ application, onPress }: Props) {  
    return (
        <Pressable onPress = {onPress}>
            <View style={styles.container}>
                <Image source={{ uri: application.photo_url }} style={styles.photo}/>

                <View style={styles.textBlock}>
                    <Text style={typography.cardTitle}>{application.dog_name}</Text>
                    <Text 
                        style={typography.cardSubtitle}
                        accessibilityLabel={`Submitted ${formatDateAccessible(application.submitted_at)}`}
                    >
                        Submitted: {formatDate(application.submitted_at)}
                    </Text>
                    <Text style={typography.cardSubtitle}>{`Status: ${applicationStatusLabels[application.status]}`}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20}/>
            </View>
        </Pressable>
            
    )
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm + 4,
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: spacing.sm + 4,
    },
    photo: { 
        width: 64, 
        height: 64, 
        borderRadius: radii.md
    },
    textBlock: {
        flex: 1,
    },
})

