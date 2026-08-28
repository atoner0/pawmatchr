import { colors, radii, spacing, typography } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";



export default function DogIntroSection() {
    return (
        <View style={styles.section}>
            <Text style={typography.sectionTitle}>What the pet introduction visit involves</Text>

            <Text style={styles.introBox}>
                Because you currently have a dog at home, your adoption process includes a meeting between your dog and the dog you're hoping to adopter
            </Text>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Led by shelter staff</Text>
                <Text style={styles.blockText}>
                    A staff member runs the introduction and reads the dogs' body language throughout. Your role is to stay calm, follow their lead, and watch your own dog's reactions.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>On neutral ground</Text>
                <Text style={styles.blockText}>
                    The meeting happens at the shelter, not your home. This reduces the chance of territorial behaviour and gives both dogs a fairer first impression
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Some nervousness is normal</Text>
                <Text style={styles.blockText}>
                    Shelter dogs often behave differenly in a shelter setting. Lead-pulling, over-excitement, or initial shyness are common and don't necessarily reflect how they'll be at home. Staff are watching for something more specific: sustained growling, lunging, or an overall inability to settle.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>A little preparation helps</Text>
                <Text style={styles.blockText}>
                    A walk beforehand can help your dog arrive more settled and less over-aroused.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>One meeting isn't the final word</Text>
                <Text style={styles.blockText}>
                    A good first meeting doesn't guarantee long-term success, and an awkward one doesn't rule it out either. Some rescues offer a second meeting if the first felt inconclusive. You're not expected to decide on the spot.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>If it doesn't go smoothly</Text>
                <Text style={styles.blockText}>
                    That's useful information, not a failure. It's exactly what the visit is for. Staff can advise on next steps, and your trainer directory has certified professionals if further guidance is needed.
                </Text>
            </View>

        </View>
        
    );
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    section: {
        gap: spacing.sm + 4,
        marginBottom: spacing.lg,
    },
    introBox: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
    },
    block: {
        gap: 3,
    },
    blockTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    blockText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
    },
});
